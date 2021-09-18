const pg = require('../services/pg.service');

exports.getRecipes = async function(){
    const result = await pg.query('SELECT * FROM user_recipe WHERE userid = $1', [/* values*/ ]);
    return result;
}