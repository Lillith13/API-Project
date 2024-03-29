const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const {
  postRevImgErrChecks,
  reviewEditErrChecks,
} = require("../../utils/reviewErrorCheckers.js");
const { reviewExists } = require("../../utils/recordExists.js");
const { reviewBelongsToUser } = require("../../utils/belongsToUser.js");

const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

// GET ALL Reviews
router.get("/current", requireAuth, async (req, res) => {
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

  const spots = await Spot.findAll({
    attributes: {
      exclude: ["description", "createdAt", "updatedAt"],
    },
  });
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
      if (rev.id === revImg.dataValues.reviewId) {
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

// POST Image -> Review by reviewId
router.post(
  "/:reviewId/images",
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
    await reviewToEdit.save();
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
