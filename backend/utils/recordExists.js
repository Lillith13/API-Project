const {
  Spot,
  Review,
  Booking,
  SpotImage,
  ReviewImage,
} = require("../db/models");

async function spotImageExists(req, _res, next) {
  const spotImage = await SpotImage.findByPk(req.params.imageId);
  if (!spotImage) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot Image couldn't be found";
    return next(err);
  }
  next();
}

async function revImageExists(req, _res, next) {
  const revImage = await ReviewImage.findByPk(req.params.imageId);
  if (!revImage) {
    const err = new Error();
    err.status = 404;
    err.message = "Review Image couldn't be found";
    return next(err);
  }
  next();
}

async function spotExists(req, _res, next) {
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }
  next();
}

async function reviewExists(req, _res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    const err = new Error();
    err.status = 404;
    err.message = "Review couldn't be found";
    return next(err);
  }
  next();
}

async function bookingExists(req, _res, next) {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    const err = new Error();
    err.status = 404;
    err.message = "Booking couldn't be found";
    return next(err);
  }
  next();
}

module.exports = {
  spotExists,
  reviewExists,
  bookingExists,
  spotImageExists,
  revImageExists,
};
