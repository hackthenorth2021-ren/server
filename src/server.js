const express = require('express');
const dotenv = require('dotenv');
const recipeRoute = require('./routes/recipeRoute');
const inventoryRoute = require('./routes/inventoryRoute');
const { errorHandler, HttpError } = require('./utils/error');
const auth = require('./services/auth.service');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/recipe-images', express.static('recipe-images'));
app.use('/api/v1/*', auth);
app.use('/api/v1/inventory', inventoryRoute);
app.use('/api/v1/recipe', recipeRoute);
app.use('/api/v1/*', (_req, _res, next) => {
  next(new HttpError(404, 'Invalid route.'));
});
app.use(errorHandler);

const port = process.env.HTTP_PORT;
app.listen(port, () => {
  console.log(`HTN Server running on port ${port}`);
});