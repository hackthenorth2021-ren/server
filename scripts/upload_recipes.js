const { pool } = require('../src/services/pg.service');
const recipes = require('../data/recipes.json');

const addIngredientQuery = 'INSERT INTO Ingredients(name) VALUES($1)';
const addRecipeQuery = 'INSERT INTO Recipes(name, image, preptime, directions) VALUES($1, $2, $3, $4)';
const getRecipeId = 'SELECT id FROM Recipes WHERE name = $1';
const getIngredientId = 'SELECT id FROM Ingredients WHERE name= $1';
const addRelationQuery = 'INSERT INTO Recipes_Ingredients(recipeid, ingredientid, amount) VALUES($1, $2, $3)';

const recipeIds = [
  '694546305183721233',
  '694546305481647889',
  '694546305767876369',
  '694546306103256849',
  '694546306408064785',
  '694546306666407697',
  '694546306931271441',
  '694546307242501905'
];

(async () => {
  let i = 0;
  for (const id in recipes) {
    const recipe = recipes[id];
    for (const ingredient of recipe.ingredients) {
      const result = await pool.query(getIngredientId, [ingredient[0]]);
      const ingId = result.rows[0].id;
      await pool.query(addRelationQuery, [recipeIds[i], ingId, ingredient[1]]);
    }
    // await pool.query(addRecipeQuery, [recipe.title, `${recipe.title}.jpg`, (Math.floor(Math.random()*10)+4)*5, recipe.instructions])
    // const result = await pool.query(getRecipeId, [recipe.title]);
    // console.log(result.rows[0].id);
    // for (const ingredient of recipe.ingredients) {
    //   console.log(ingredient);
    //   try {
    //     await pool.query(addIngredientQuery, [ ingredient[0].toLowerCase() ]);
    //   } catch (err) {
    //     console.log(`${ingredient[0]} already exists`);
    //   }
    // }
    i++;
  }
})();
