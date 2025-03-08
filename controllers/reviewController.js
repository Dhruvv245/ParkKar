const Review = require(`./../models/reviewModel`);
const catchAsync = require(`./../utils/catchAsync`);
const factory = require(`./factoryHandler`);

exports.setParkingUserIds = (req, res, next) => {
  if (!req.body.parking) req.body.parking = req.params.parkingId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
