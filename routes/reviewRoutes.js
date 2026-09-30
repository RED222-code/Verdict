const express = require('express');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authController');
const { restrictReviewToOwnerOrAdmin } = require('../middleware/reviewAuthorization');

const router = express.Router();

router.route('/').get(getReviews).post(protect, createReview);
router.get('/stats', getReviewStats);
router.route('/:id').get(getReview).patch(protect, restrictReviewToOwnerOrAdmin, updateReview).delete(protect, restrictReviewToOwnerOrAdmin, deleteReview);

module.exports = router;
