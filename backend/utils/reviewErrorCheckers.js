const { Spot, Review, ReviewImage } = require("../db/models");

async function spotExists(req, _res, next) {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    next(err);
  }
  next();
}

async function reviewExists(req, _res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }
  next();
}

async function postRevErrChecks(req, _res, next) {
  const err = new Error("Bad Request");
  err.errors = {};
  let errTriggered = false;

  const reviewQueried = await Review.findAll({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id,
    },
  });
  if (reviewQueried.length > 0) {
    err.status = 500;
    err.message = "User already has a review for this spot";
    next(err);
  }

  const { review, stars } = req.body;
  if (!review) {
    err.errors.review = "Review text is required";
    errTriggered = true;
  }
  if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
    err.errors.stars = "Stars must be an integer from 1 to 5";
    errTriggered = true;
  }
  if (errTriggered) return next(err);
  next();
}

async function postRevImgErrChecks(req, _res, next) {
  const err = new Error("Bad Request");
  err.errors = {};

  const revImgs = await ReviewImage.findAll({
    where: {
      reviewId: req.params.reviewId,
    },
  });
  if (revImgs.length >= 10) {
    err.status = 403;
    err.message = "Maximum number of images for this resource was reached";
    return next(err);
  }
  next();
}

async function reviewEditErrChecks(req, _res, next) {
  const err = new Error("Bad Request");
  err.errors = {};
  let errTriggered = false;
  const { review, stars } = req.body;

  if (!review) {
    err.errors.review = "Review text is required";
    errTriggered = true;
  }
  if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
    err.errors.stars = "Stars must be an integer from 1 to 5";
    errTriggered = true;
  }
  if (errTriggered) return next(err);
  next();
}

async function reviewBelongsToUser(req, _res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (review["userId"] !== req.user.id) {
    err.status = 403;
    err.message = "You cannot edit a review that does not belong to you";
    next(err);
  }
  next();
}

module.exports = {
  spotExists,
  reviewExists,
  postRevErrChecks,
  postRevImgErrChecks,
  reviewEditErrChecks,
  reviewBelongsToUser,
};
