const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  createProduct,
  getAllProducts,
  purchaseProduct,
  restockProduct,
  getProductHistory,
} = require('../controllers/productController');

// All routes below are protected (require authentication)
router.use(protect);

// Product CRUD routes
router.post('/', createProduct);
router.get('/', getAllProducts);

// Purchase and Restock routes
router.post('/purchase', purchaseProduct);
router.post('/restock', restockProduct);

// Transaction history route
router.get('/:productId/history', getProductHistory);

module.exports = router;

