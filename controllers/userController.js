const User = require('../models/userModel');
const { APIFeatures, AppError, catchAsync, createToken } = require('../utils');

function signToken(user) {
  return createToken({ id: user._id.toString(), role: user.role });
}

function sendToken(user, statusCode, res) {
  const token = signToken(user);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password) return next(new AppError('Name, email, and password are required', 400));
  if (password !== passwordConfirm) return next(new AppError('Passwords do not match', 400));

  const user = await User.create({ name, email, password });
  user.password = undefined;
  sendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid login credentials', 401));
  }

  user.password = undefined;
  sendToken(user, 200, res);
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
  const users = await features.query;
  res.status(200).json({ status: 'success', data: users });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ status: 'success', data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
