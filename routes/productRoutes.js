const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getCategoryStats
} = require('../controllers/productController');
const { topRated, cheap, available } = require('../middleware/productAliases');
const { protect, restrictTo } = require('../middleware/authController');

const router = express.Router();

router.route('/').get(getProducts).post(protect, restrictTo('admin'), createProduct);
router.get('/stats', getProductStats);
router.get('/category-stats', getCategoryStats);
router.get('/top-rated', topRated, getProducts);
router.get('/cheap', cheap, getProducts);
router.get('/available', available, getProducts);
router.route('/:id').get(getProduct).patch(protect, restrictTo('admin'), updateProduct).delete(protect, restrictTo('admin'), deleteProduct);

module.exports = router;
