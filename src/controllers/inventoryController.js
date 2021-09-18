const { validate } = require('../utils/validation');
const model = require('../models/inventoryModel');
const { matchFoodExpiry } = require('../services/food.service');
const path = require('path');
const fs = require('fs');
const { HttpError } = require('../utils/error');
const { spawn } = require('child_process');


exports.getInventory = async function(req, res, next) {
  if (!validate(req, next)) {
    return;
  }
  let { user, search, orderBy } = req.query;
  let [orderParam, order] = (orderBy || '').split(' ');

  if (!search) {
    search = '';
  }
  if (!(orderParam === 'name' || orderParam === 'expiryDate')) {
    orderParam = 'name';
  }
  if (!(order == 'ASC' || order == 'DESC')) {
    order = 'ASC';
  }
  
  // Use UserID to getInventory
  try {
    var result = await model.getInventory(user, search, orderParam, order);
    res.send(result);
  } catch (err) {
    next(err);
  }
}

exports.processReceipt = async function (req, res, next) {
  if (!validate(req, next)){
      return;
  }
  
  try {
    const curPath = req.file.path;
    const curFileInfo = path.parse(curPath);
    const origFileInfo = path.parse(req.file.originalname);
    const destPath = path.join(__dirname, 
      `../../uploads/${curFileInfo.base}${origFileInfo.ext}`);
    const fileExt = origFileInfo.ext.toLowerCase();

    if (fileExt === '.png' || fileExt === '.jpg') {
      fs.renameSync(curPath, destPath);
    } else {
      return next(new HttpError(400, 'File must be a PNG image.'));
    }

    const proc = spawn('python', [
      path.resolve(__dirname, '../../scripts/preprocess.py'),
      destPath,
      path.resolve(__dirname, 
        `../../${curFileInfo.name}_processed${origFileInfo.ext}`)
    ]);
  
    const matchedFoodNames = await new Promise((resolve, reject) => {
      proc.stdout.on('data', (data) => resolve(JSON.parse(data)));
      proc.stderr.on('data', (err) => reject(err));
    });
    
    const newFoodItems = matchFoodExpiry(matchedFoodNames);

    res.send(JSON.stringify(newFoodItems));

  } catch (err) {
    return next(err);
  }
}

exports.addFood = async function (req, res, next) {
    if(!validate(req, next)){
        return;
    }
    await model.addFood();
}

exports.deleteFood = async function (req, res, next) {
  if (!validate(req, next)){
    return;
  }
  // Delete food from inventoryitems
  // Maybe: Delete recipes related to deleted food?
  await model.deleteFood();
}

