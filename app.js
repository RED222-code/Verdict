const express = require('express');
const mongoose = require('mongoose');
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

// Lazy MongoDB connection for serverless environments (Vercel).
// Locally, server.js connects before any request arrives, so this falls through.
let connectionPromise;
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) return next(new AppError('Database not configured', 500));
    // Share a cold-start connection across simultaneous requests. Clear the
    // promise after each attempt so failures and later disconnects can recover.
    if (!connectionPromise) {
      connectionPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
        .finally(() => { connectionPromise = undefined; });
    }
    await connectionPromise;
    next();
  } catch (err) {
    // Log only the error type: driver messages can contain connection details.
    console.error('MongoDB connection failed:', err.name);
    next(new AppError('Database connection failed', 503));
  }
});

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
