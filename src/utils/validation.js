const { body, query, validationResult } = require('express-validator');
const { HttpError } = require('./error');

exports.getInventorySchema = [
  query('user')
    .notEmpty()
    .isString(),
  query('search')
    .optional()
    .isString(),
  query('orderBy')
    .optional()
    .isString()
];

exports.deleteFoodSchema= [
  query('user')
    .notEmpty()
    .isString(),
  query('id')
    .notEmpty()
]

exports.getRecipeSchema = [
  query('user')
    .notEmpty()
    .isString()
]

exports.validate = function (req, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError(400, 'Invalid parameters.', errors));
    return false;
  }
  return true;
}