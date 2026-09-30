const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  comment: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  dateCreated: { type: Date, default: Date.now }
});

reviewSchema.pre(/^find/, function populateRefs(next) {
  this.populate('userId', 'name email role').populate('productId', 'name price category averageRating numberOfRatings');
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
