const pg = require('../services/pg.service');

const getInventoryQuery = "SELECT id, name, type, creationDate, expiryDate "
  + "FROM InventoryItems inv "
  + "WHERE inv.userId = (SELECT id FROM Users WHERE email = $1) "
  + "AND ($2 = '' OR $2 = inv.name) "
  + "ORDER BY";

// https://node-postgres.com/features/pooling
exports.getInventory = async function(userEmail, searchStr, orderBy, order) {
  const result = await pg.query(`${getInventoryQuery} ${orderBy} ${order}`, 
    [ userEmail, searchStr ]);
  return result.rows;
}

exports.addFood = async function() {
    const result = await pg.query('INSERT INTO inventoryitems VALUES($1, $2, $3, $4, $5, $6)', [/* id, name, type, creationdate, expirydate, userid */]);
    return result;
}

exports.deleteFood = async function() {
    const result = await pg.query('DELETE FROM inventoryitems where user_id = $1 AND name = $2', [/* userid, name */]);
    return result;
}