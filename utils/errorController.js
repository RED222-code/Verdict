const { AppError } = require('./index');

function sendErrorDev(err, res) {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
}

function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(`Duplicate value for ${field}`, 409);
}

function handleValidationError(err) {
  const messages = Object.values(err.errors || {}).map((error) => error.message);
  return new AppError(messages.join('. '), 400);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);

  return sendErrorProd(error, res);
};
