const {
  Spot,
  Review,
  Booking,
  SpotImage,
  ReviewImage,
} = require("../db/models");

async function spotBelongsToUser(req, _res, next) {
  const spotImg = await SpotImage.findByPk(req.params.imageId);
  const spot = await Spot.findByPk(spotImg.spotId);
  if (req.user.id !== spot.ownerId) {
    const err = new Error("Spot doesn't belong to you");
    err.status = 403;
    return next(err);
  }
  next();
}

async function reviewBelongsToUser(req, _res, next) {
  const revImg = await ReviewImage.findByPk(req.params.imageId);
  console.log(revImg);
  console.log(revImg["reviewId"]);
  const review = await Review.findByPk(revImg["reviewId"]);
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
