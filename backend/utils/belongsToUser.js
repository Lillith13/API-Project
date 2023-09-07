const { Spot, Review, Booking } = require("../db/models");

async function spotBelongsToUser(req, _res, next) {
  const spot = await Spot.findByPk(req.params.spotId);
  if (req.user.id !== spot.ownerId) {
    const err = new Error("Spot doesn't belong to you");
    err.status = 403;
    return next(err);
  }
  next();
}

async function reviewBelongsToUser(req, _res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (review["userId"] !== req.user.id) {
    const err = new Error("Review doesn't belong to you");
    err.status = 403;
    next(err);
  }
  next();
}

async function bookingBelongsToUser(req, _res, next) {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (req.user.id !== booking.userId) {
    const err = new Error("Booking doesn't belong to you");
    err.status = 403;
    next(err);
  }
  next();
}

module.exports = {
  spotBelongsToUser,
  reviewBelongsToUser,
  bookingBelongsToUser,
};
