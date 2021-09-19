const { pool } = require('../services/pg.service');

const getRecipesQuery = "SELECT * FROM user_recipe "
    + "WHERE userid = (SELECT id FROM Users WHERE email = $1)"

exports.getRecipes = async function(userEmail){
    const result = await pool.query(getRecipesQuery, [ userEmail ]);
    return result;
}