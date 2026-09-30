const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], unique: true, trim: true, minlength: [3, 'Product name must be at least 3 characters'], maxlength: [80, 'Product name must be at most 80 characters'] },
  slug: { type: String, unique: true, trim: true },
  price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Product price cannot be negative'] },
  category: { type: String, required: [true, 'Product category is required'], trim: true },
  description: { type: String, required: [true, 'Product description is required'], trim: true, minlength: [10, 'Description must be at least 10 characters'] },
  coverImageName: { type: String, trim: true },
  otherImageNames: { type: [String], default: [] },
  quantityAvailable: { type: Number, required: [true, 'Quantity available is required'], min: [0, 'Quantity cannot be negative'] },
  availabilityStatus: { type: String, required: [true, 'Availability status is required'], trim: true, enum: ['available', 'out-of-stock', 'discontinued'] },
  averageRating: { type: Number, default: 0, min: [0, 'Average rating cannot be below 0'], max: [5, 'Average rating cannot be above 5'] },
  numberOfRatings: { type: Number, default: 0, min: [0, 'Number of ratings cannot be negative'] },
  dateCreated: { type: Date, default: Date.now }
});

productSchema.pre('save', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

productSchema.post('save', function logSave(doc, next) {
  console.log(`Product saved: ${doc.name}`);
  next();
});

module.exports = mongoose.model('Product', productSchema);
