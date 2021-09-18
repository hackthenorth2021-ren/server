const express = require('express');
const { getRecipeSchema } = require('../utils/validation');
const { getRecipes } = require('../controllers/recipeController');

const router = express.Router();
router.get('/get-recipes', getRecipeSchema, getRecipes);

module.exports = router;