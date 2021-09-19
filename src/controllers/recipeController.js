const { validate } = require('../utils/validation');
const model = require('../models/recipeModel');

exports.getRecipes = function(req, res, next) {
  if (!validate(req, next)) {
    return;
  }
  let { user } = req.query;
  const result = model.getRecipes(user);
  return result;
}
