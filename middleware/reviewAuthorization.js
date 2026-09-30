const { AppError, catchAsync } = require('../utils');
const Review = require('../models/reviewModel');

exports.restrictReviewToOwnerOrAdmin = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).select('userId');
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  const reviewOwnerId = (review.userId && review.userId._id ? review.userId._id : review.userId).toString();
  if (req.user.role !== 'admin' && reviewOwnerId !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  req.review = review;
  next();
});
