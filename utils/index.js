const crypto = require('crypto');
const mongoose = require('mongoose');

const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

function catchAsync(fn) {
  return function catchAsyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createSignature(input, secret) {
  return crypto.createHmac('sha256', secret).update(input).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 24 * 7);

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const input = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(input, secret);

  return `${input}.${signature}`;
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterObject = {};
    this.page = 1;
    this.limit = 0;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((field) => delete queryObject[field]);

    const queryText = JSON.stringify(queryObject).replace(/\b(gte|gt|lte|lt|regex|options)\b/g, (match) => `$${match}`);

    this.filterObject = JSON.parse(queryText);
    this.query = this.query.find(this.filterObject);
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort ? this.queryString.sort.split(',').join(' ') : '-dateCreated';

    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page || 1);
    const limit = Number(this.queryString.limit || 0);

    if (!Number.isInteger(page) || page < 1) {
      const error = new Error('Page must be a positive whole number');
      error.statusCode = 400;
      throw error;
    }

    if (this.queryString.limit && (!Number.isInteger(limit) || limit < 1)) {
      const error = new Error('Limit must be a positive whole number');
      error.statusCode = 400;
      throw error;
    }

    this.page = page;
    this.limit = limit;

    if (limit) {
      this.query = this.query.skip((page - 1) * limit).limit(limit);
    }

    return this;
  }
}

async function updateProductStats(productId) {
  if (!productId) return;

  const objectId = new mongoose.Types.ObjectId(productId);
  const result = await Review.aggregate([
    { $match: { productId: objectId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfRatings: { $sum: 1 }
      }
    }
  ]);

  const stats = result[0] || { averageRating: 0, numberOfRatings: 0 };

  await Product.findByIdAndUpdate(objectId, {
    averageRating: stats.averageRating || 0,
    numberOfRatings: stats.numberOfRatings || 0
  });
}

module.exports = {
  AppError,
  APIFeatures,
  catchAsync,
  createToken,
  updateProductStats
};
