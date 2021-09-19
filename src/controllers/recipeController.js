const { validate } = require('../utils/validation');
const model = require('../models/recipeModel');

exports.getRecipes = async function(req, res, next) {
  if (!validate(req, next)) {
    return;
  }
  let { user } = req.query;
  try {
    const result = await model.getRecipes(user);
    res.send(JSON.stringify(result));
  } catch (err){
    next(err);
  }
}

// exports.addRecipes = function(req, res, next) {
//   if (!validate(req, next)){
//     return;
//   }
  
// }