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

exports.addFoodSchema = [
  query('user')
    .notEmpty()
    .isString(),
  body('*.name')
    .notEmpty()
    .isString(),
  body('*.currentDate')
    .optional()
    .isISO8601()
    .toDate(),
  body('*.expiryDuration')
    .optional()
    .isNumeric()
    .toInt()
]

exports.deleteFoodSchema= [
  query('user')
    .notEmpty()
    .isString(),
  body('*')
    .notEmpty()
    .isString()
]

exports.getRecipeSchema = [
  query('user')
    .notEmpty()
    .isString()
]

exports.addRecipeSchema = [
  query('user')
    .notEmpty()
    .isString(),
  query('name')
    .notEmpty()
    .isString(),
  query('prepTime')
    .notEmpty(),
  query('directions')
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