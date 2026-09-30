exports.topRated = (req, res, next) => {
  req.query.sort = '-averageRating,-numberOfRatings';
  req.query.limit = req.query.limit || '5';
  next();
};

exports.cheap = (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = req.query.limit || '5';
  next();
};

exports.available = (req, res, next) => {
  req.query.availabilityStatus = 'available';
  req.query.sort = req.query.sort || '-dateCreated';
  next();
};
