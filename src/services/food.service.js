const fs = require('fs');
const Fuse = require('fuse.js');
const csv = require('fast-csv');
const path = require('path');

let foodExpiryList = [];
let fuse = new Fuse(foodExpiryList);

getData();

exports.matchFoodExpiry = function (list) {
  return list.map((food) => {
    let expiry = '';
    const results = fuse.search(food);
    if (results.length > 0 && results[0].score < 0.5) {
      const match = results[0].item;
      const plural = match.expiry > 1;
      expiry = `${match.expiry} ${match.dateType}${plural ? 's' : ''}`;
    }
    return { name: food, expiry };
  });
}

function getData() {
  fs.createReadStream(path.resolve(__dirname, '../../data/expiry.csv'))
    .pipe(csv.parse({ headers: false }))
    .on('error', err => console.error(err))
    .on('data', row => {
      const [name, expiry, dateType] = row;
      foodExpiryList.push({ name, expiry: parseInt(expiry), dateType });
    })
    .on('end', () => {
      fuse = new Fuse(foodExpiryList, { includeScore: true, keys: ['name'] });
    });
}