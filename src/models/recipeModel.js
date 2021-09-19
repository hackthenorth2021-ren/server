const { pool, performMultiQuery } = require('../services/pg.service');

const getRecipesQuery = "SELECT id, name, image, preptime, directions FROM Recipes "
    + "WHERE id NOT IN ("
        + "SELECT recipeId FROM Recipes_Ingredients WHERE "
        + "ingredientId NOT IN ("
            + "SELECT inv_ing.ingredientId FROM InventoryItems inv "
            + "INNER JOIN Inventory_Ingredients inv_ing ON inv.id = inv_ing.inventoryId "
            + "WHERE inv.userId = (SELECT id FROM Users WHERE email = $1)"
        + ")"
    + ")";

const getIngredientsQuery = "SELECT * FROM Ingredients ing "
    + "INNER JOIN Recipes_Ingredients rec_ing ON ing.id = rec_ing.ingredientId "
    + "WHERE rec_ing.recipeId = $1"

exports.getRecipes = async function(userEmail) {
    let recipes;
    await performMultiQuery(async (client) => {
        const recipeRes = await client.query(getRecipesQuery, [ userEmail ]);
        recipes = recipeRes.rows;
        for (const recipe of recipes) {
            const ingRes = await client.query(getIngredientsQuery, [ recipe.id ]);
            recipe.ingredients = ingRes.rows.map(ingredient => {
                return { name: ingredient.name, amount: ingredient.amount };
            });
        }
    });
    return recipes;
}