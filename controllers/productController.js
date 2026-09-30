const Product = require('../models/productModel');
const { APIFeatures, AppError, catchAsync } = require('../utils');

exports.getProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate();
  const products = await features.query;
  res.status(200).json({ status: 'success', data: products });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        productCount: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        minimumPrice: { $min: '$price' },
        maximumPrice: { $max: '$price' },
        averageRating: { $avg: '$averageRating' },
        totalRatings: { $sum: '$numberOfRatings' }
      }
    },
    { $project: { _id: 0 } }
  ]);
  res.status(200).json({ status: 'success', data: stats[0] || {} });
});

exports.getCategoryStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        averageRating: { $avg: '$averageRating' }
      }
    },
    { $sort: { productCount: -1 } },
    { $project: { _id: 0, category: '$_id', productCount: 1, averagePrice: 1, averageRating: 1 } }
  ]);
  res.status(200).json({ status: 'success', data: stats });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: product });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: product });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('Product not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
