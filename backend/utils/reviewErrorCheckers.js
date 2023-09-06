const { Spot, Review, ReviewImage } = require("../db/models");

const spotExists = async (spotId) => {
  const spot = await Spot.findByPk(spotId);
  !spot ? false : true;
};

const reviewByUserExists = async (userId) => {
  const review = await Review.findOne({
    where: {
      userId,
    },
  });
  !review ? false : true;
};

const reviewExists = async (reviewId) => {
  const review = await Review.findByPk(reviewId);
  return review;
};

const currRevImgs = async (reviewId) => {
  const revImgs = await ReviewImage.findAll({
    where: {
      reviewId,
    },
  });
  return revImgs.length;
};

function postRevErrChecks(req, _res, next) {
  const err = new Error("Bad Request");
  err.errors = {};
  let errTriggered = false;
  if (!spotExists(req.params.spotId)) {
    err.status = 404;
    err.message = "Spot couldn't be found";
    next(err);
  }
  if (!reviewByUserExists(req.user.id).length > 0) {
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

function postRevImgErrChecks(req, _res, next) {
  const err = new Error("Bad Request");
  err.errors = {};
  const review = reviewExists(req.params.reviewId);
  if (!review || review == undefined) {
    err.status = 404;
    err.message = "Review couldn't be found";
    return next(err);
  }
  if (review["userId"] !== req.user.id) {
    err.status = 403;
    err.message = "You cannot add images to reviews that do not belong to you";
  }
  if (currRevImgs >= 10) {
    err.status = 403;
    err.message = "Maximum number of images for this resource was reached";
    return next(err);
  }
  next();
}

module.exports = {
  spotExists,
  postRevErrChecks,
  postRevImgErrChecks,
};
