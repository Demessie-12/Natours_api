const catchAsync = require('../utilis/catchAsync');
const Review = require('./../models/reviewmodel');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.CreateReview = factory.CreateOne(Review);
exports.DeleteReview = factory.DeleteOne(Review);
exports.UpdateReview = factory.UpdateOne(Review);
