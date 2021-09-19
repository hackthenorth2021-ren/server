const express = require('express');
const { getRecipeSchema, addRecipeSchema } = require('../utils/validation');
const { getRecipes, addRecipe } = require('../controllers/recipeController');

const router = express.Router();
router.get('/get-recipes', getRecipeSchema, getRecipes);
// router.post('/add-recipe', addRecipeSchema, addRecipe);

module.exports = router;