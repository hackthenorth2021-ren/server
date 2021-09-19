const { pool } = require('../services/pg.service');


const getInventoryQuery = "SELECT id, name, type, creationDate, expiryDate "
  + "FROM InventoryItems inv "
  + "WHERE inv.userId = (SELECT id FROM Users WHERE email = $1) "
  + "AND ($2 = '' OR $2 = inv.name) "
  + "ORDER BY";

const getUserIdQuery = "SELECT id FROM Users WHERE email = $1";

const addFoodQuery = "INSERT INTO InventoryItems(name, type, creationDate, "
  + "expiryDate, userId) VALUES ($1, $2, $3, $4, $5)";

const addFoodQueryNoExpiry = "INSERT INTO InventoryItems(name, type, creationDate, "
  + "userId) VALUES ($1, $2, $3, $4)";

const deleteFoodQuery = "DELETE FROM InventoryItems "
  + "WHERE userid = $1 AND id = $2";


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
      const { name, type, creationDate, expiryDate } = foodItem
      if (expiryDate) {
        await client.query(addFoodQuery, 
          [name, type, creationDate, expiryDate, userId]);
      } else {
        await client.query(addFoodQueryNoExpiry, 
          [name, type, creationDate, userId]);
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

async function performMultiQuery(multiQuery) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await multiQuery(client);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}