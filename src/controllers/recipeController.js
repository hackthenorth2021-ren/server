const { validate } = require('../utils/validation');
const model = require('../models/recipeModel');

exports.getRecipes = function(req, res, next) {
  if (!validate(req, next)) {
    return;
  }
  const result = model.getRecipes();
  return result;
}
