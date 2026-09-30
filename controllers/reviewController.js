const Review = require('../models/reviewModel');
const { APIFeatures, AppError, catchAsync, updateProductStats } = require('../utils');

exports.getReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query).filter().sort().limitFields().paginate();
  const reviews = await features.query
    .populate('userId', 'name email role')
    .populate('productId', 'name price category averageRating numberOfRatings');
  res.status(200).json({ status: 'success', data: reviews });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('userId', 'name email role')
    .populate('productId', 'name price category averageRating numberOfRatings');
  if (!review) return next(new AppError('Review not found', 404));
  res.status(200).json({ status: 'success', data: review });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { title, comment, rating, productId } = req.body;
  const review = await Review.create({ title, comment, rating, productId, userId: req.user._id });
  await updateProductStats(review.productId);
  await review.populate('userId', 'name email role');
  await review.populate('productId', 'name price category averageRating numberOfRatings');
  res.status(201).json({ status: 'success', data: review });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const oldReview = req.review || (await Review.findById(req.params.id));
  if (!oldReview) return next(new AppError('Review not found', 404));
  const { title, comment, rating, productId } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { title, comment, rating, productId },
    { new: true, runValidators: true }
  );
  await updateProductStats(oldReview.productId);
  if (review.productId.toString() !== oldReview.productId.toString()) {
    await updateProductStats(review.productId);
  }
  await review.populate('userId', 'name email role');
  await review.populate('productId', 'name price category averageRating numberOfRatings');
  res.status(200).json({ status: 'success', data: review });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return next(new AppError('Review not found', 404));
  await updateProductStats(review.productId);
  res.status(204).json({ status: 'success', data: null });
});

exports.getReviewStats = catchAsync(async (req, res, next) => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: null,
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $project: { _id: 0 } }
  ]);
  const distribution = await Review.aggregate([
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, rating: '$_id', count: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: { summary: stats[0] || { reviewCount: 0, averageRating: 0 }, distribution }
  });
});
