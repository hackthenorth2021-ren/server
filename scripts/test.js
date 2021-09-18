const { spawn } = require('child_process');

const { matchFoodExpiry } = require('../src/services/food.service');

(async () => {

  const proc = spawn('python', [
    './preprocess.py',
    'uploads/output.jpg',
    'uploads/output_processed.jpg'
  ]);

  const foodItems = await new Promise((resolve, _reject) => {
    proc.stdout.on('data', (data) => resolve(JSON.parse(data)));
  });
  
  console.log(matchFoodExpiry(foodItems));
})();
