const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const {
  spotExists,
  postRevErrChecks,
  postRevImgErrChecks,
} = require("../../utils/reviewErrorCheckers.js");

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
      exclude: ["username"],
    },
  });

  const spots = await Spot.scope("defaultScope").findAll({
    include: [
      {
        model: SpotImage,
        as: "previewImage",
        where: {
          isPreview: true,
        },
      },
    ],
  });

  const revImgs = await ReviewImage.scope("defaultScope").findAll();

  const results = { Reviews: [] };
  for (let review of reviews) {
    let rev = review.toJSON();
    for (let spot of spots) {
      if (rev.spotId === spot["id"]) {
        rev.Spot = spot;
      }
    }
    rev.ReviewImages = [];
    for (let revImg of revImgs) {
      if (rev.spotId === revImg["spotId"]) {
        rev.ReviewImages.push(revImg);
      }
    }
    results.Reviews.push(rev);
  }

  return res.json(results);
});

// GET ALL Reviews by spotId
router.get("/spot/:spotId", async (req, res, next) => {
  if (!spotExists(req.params.spotId)) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  const spotReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: {
      model: User,
      exclude: ["username"],
    },
  });
  const spotRevImgs = await ReviewImage.findAll();
  const results = { Reviews: [] };
  for (let spotReview of spotReviews) {
    const spotRev = spotReview.toJSON();
    spotRev.ReviewImages = [];
    for (let spotRevImg of spotRevImgs) {
      if (spotRevImg["reviewId"] === spotRev.id) {
        spotRev.ReviewImages.push(spotRevImg);
      }
    }
    results.Reviews.push(spotRev);
  }
  return res.json(results);
});

// POST Review -> Spot by spotId
router.post(
  "/spot/:spotId",
  [requireAuth, postRevErrChecks],
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
  [requireAuth, postRevImgErrChecks],
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
router.put("/:reviewId", async (req, res) => {
  //
});

// DELETE Review by reviewId
router.delete("/:reviewId", async (req, res) => {
  //
});

module.exports = router;
