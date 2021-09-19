const { pool, performMultiQuery } = require('../services/pg.service');
const Fuse = require('fuse.js');


const getInventoryQuery = "SELECT id, name, type, creationDate, expiryDate "
  + "FROM InventoryItems inv "
  + "WHERE inv.userId = (SELECT id FROM Users WHERE email = $1) "
  + "AND ($2 = '' OR $2 = inv.name) "
  + "ORDER BY";

const getUserIdQuery = "SELECT id FROM Users WHERE email = $1";

const addFoodQuery = "INSERT INTO InventoryItems(name, type, creationDate, "
  + "expiryDate, userId) VALUES ($1, $2, $3, $4, $5) RETURNING id";

const addFoodQueryNoExpiry = "INSERT INTO InventoryItems(name, type, "
  + "creationDate, userId) VALUES ($1, $2, $3, $4) RETURNING id";

const deleteFoodQuery = "DELETE FROM InventoryItems "
  + "WHERE userid = $1 AND id = $2";

const getIngredientsQuery = "SELECT id, name FROM Ingredients";

const addInvIngredRel = "INSERT INTO Inventory_Ingredients "
  + "(inventoryid, ingredientid) VALUES ($1, $2)";

// const getInventoryIdQuery = "SELECT id FROM InventoryItems WHERE name = $1 AND "
//   + "creationDate = $2 AND (expiryDate IS NULL OR expiryDate = $3)";


let fuse = new Fuse([]);
getIngredients()
  .then((ingredients) => {
    fuse = new Fuse(ingredients, { includeScore: true, keys: ['name'] });
  })
  .catch(err => console.error(err));


// https://node-postgres.com/features/pooling
exports.getInventory = async function(userEmail, searchStr, orderBy, order) {
  const result = await pool.query(
    `${getInventoryQuery} ${orderBy} ${order}`, 
    [ userEmail, searchStr ]);
  return result.rows;
}

exports.addFood = async function(userEmail, foodItems) {
  const userId = await getUserId(userEmail);
  await performMultiQuery(async (client) => {
    for (const foodItem of foodItems) {
      const { name, type, creationDate, expiryDate } = foodItem;
      let queryRes;
      if (expiryDate) {
        queryRes = await client.query(addFoodQuery, 
          [name, type, creationDate, expiryDate, userId]);
      } else {
        queryRes = await client.query(addFoodQueryNoExpiry, 
          [name, type, creationDate, userId]);
      }
      const inventoryId = queryRes.rows[0].id;
      const results = fuse.search(name.toLowerCase());
      if (results.length > 0 && results[0].score < 0.25) {
        await client.query(addInvIngredRel, 
          [inventoryId, results[0].item.id])
      }
    }
  });
}

exports.deleteFood = async function(userEmail, foodIds) {
  const userId = await getUserId(userEmail);
  await performMultiQuery(async (client) => {
    for (const foodId of foodIds) {
      await client.query(deleteFoodQuery, [userId, foodId]);
    }
  });
}

async function getUserId(userEmail) {
  const result = await pool.query(getUserIdQuery, [ userEmail ]);
  const userId = result.rows[0].id;
  if (!userId) {
    throw new Error('Failed to get user id from email');
  }
  return userId;
}

// async function getInventoryId(name, creationDate, expiryDate) {
//   const result = await pool.query(getInventoryIdQuery, 
//     [ name, creationDate, expiryDate ]);
//   const inventoryId = result.rows[0].id;
//   if (!inventoryId) {
//     throw new Error('Failed to get inventory id');
//   }
//   return inventoryId;
// }

async function getIngredients() {
  const result = await pool.query(getIngredientsQuery);
  const ingredients = result.rows;
  fuse = new Fuse(ingredients, { includeScore: true, keys: ['name'] });
  return ingredients;
}