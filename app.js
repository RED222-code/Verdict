const express = require('express');
const { AppError } = require('./utils');
const globalErrorHandler = require('./utils/errorController');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Product Review API is running',
    docs: '/api/v1/users'
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404)));

app.use(globalErrorHandler);

module.exports = app;
