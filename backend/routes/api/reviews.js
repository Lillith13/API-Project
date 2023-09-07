const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const {
  postRevErrChecks,
  postRevImgErrChecks,
  reviewEditErrChecks,
} = require("../../utils/reviewErrorCheckers.js");
const { spotExists, reviewExists } = require("../../utils/recordExists.js");
const { reviewBelongsToUser } = require("../../utils/belongsToUser.js");

const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

// GET ALL Reviews
router.get("/", requireAuth, async (req, res) => {
  const reviews = await Review.scope("defaultScope").findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: User,
      attributes: {
        exclude: [
          "username",
          "hashedPassword",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  });

  const spots = await Spot.scope("defaultScope").findAll();
  const prevImgs = await SpotImage.findAll({
    where: {
      preview: true,
    },
  });

  const revImgs = await ReviewImage.scope("defaultScope").findAll();

  const results = { Reviews: [] };
  for (let review of reviews) {
    let rev = review.toJSON();
    for (let spot of spots) {
      if (rev.spotId === spot["id"]) {
        spot = spot.toJSON();
        for (let prevImg of prevImgs) {
          if (prevImg["spotId"] === spot.id) spot.previewImage = prevImg["url"];
        }
        rev.Spot = spot;
      }
    }
    rev.ReviewImages = [];
    for (let revImg of revImgs) {
      if (rev.spotId === revImg.dataValues.reviewId) {
        rev.ReviewImages.push({
          id: revImg.dataValues.id,
          url: revImg.dataValues.url,
        });
      }
    }
    results.Reviews.push(rev);
  }

  return res.json(results);
});

// GET ALL Reviews by spotId
router.get("/spot/:spotId", spotExists, async (req, res) => {
  const spotReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: {
      model: User,
      attributes: {
        exclude: [
          "username",
          "hashedPassword",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  });
  const spotRevImgs = await ReviewImage.findAll();

  const results = { Reviews: [] };
  for (let spotReview of spotReviews) {
    const spotRev = spotReview.toJSON();
    spotRev.ReviewImages = [];
    for (let spotRevImg of spotRevImgs) {
      if (spotRevImg["reviewId"] === spotRev.id) {
        spotRev.ReviewImages.push({
          id: spotRevImg["id"],
          url: spotRevImg["url"],
        });
      }
    }
    results.Reviews.push(spotRev);
  }
  return res.json(results);
});

// POST Review -> Spot by spotId
router.post(
  "/spot/:spotId",
  [requireAuth, spotExists, postRevErrChecks],
  async (req, res) => {
    const { review, stars } = req.body;
    const newReview = await Review.create({
      spotId: req.params.spotId,
      userId: req.user.id,
      review,
      stars,
    });
    return res.json(newReview);
  }
);

// POST Image -> Review by reviewId
router.post(
  "/:reviewId",
  [requireAuth, reviewExists, reviewBelongsToUser, postRevImgErrChecks],
  async (req, res) => {
    const { url } = req.body;
    const newReviewImg = await ReviewImage.create({
      reviewId: req.params.reviewId,
      url,
    });
    return res.json({
      id: newReviewImg["id"],
      url,
    });
  }
);

// PUT Review by reviewId
router.put(
  "/:reviewId",
  [requireAuth, reviewExists, reviewBelongsToUser, reviewEditErrChecks],
  async (req, res) => {
    const { review, stars } = req.body;
    const reviewToEdit = await Review.findByPk(req.params.reviewId);
    if (review) reviewToEdit.review = review;
    if (stars) reviewToEdit.stars = stars;
    reviewToEdit.save();
    return res.json(reviewToEdit);
  }
);

// DELETE Review by reviewId
router.delete(
  "/:reviewId",
  [requireAuth, reviewExists, reviewBelongsToUser],
  async (req, res) => {
    const delRev = await Review.findByPk(req.params.reviewId);
    try {
      await delRev.destroy();
      return res.json({
        message: "Review deleted successfully",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
