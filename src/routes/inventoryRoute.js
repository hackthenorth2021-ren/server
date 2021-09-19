const express = require('express');
const { getInventorySchema, addFoodSchema, deleteFoodSchema } = require('../utils/validation');
const { getInventory, processReceipt, addFood, deleteFood } = require('../controllers/inventoryController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.get('/get-inventory', getInventorySchema, getInventory);
router.post('/process-receipt', upload.single('receipt'), processReceipt);
router.post('/add-food', addFoodSchema, addFood);
router.delete('/delete-food', deleteFoodSchema, deleteFood);

module.exports = router;