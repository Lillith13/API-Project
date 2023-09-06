const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const {
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

// GET ALL Reviews written by current user
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
    where: {
      ownerId: req.user.id,
    },
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
  const reviews = await Review.scope("defaultScope").findAll({
    include: [
      {
        model: User,
        exclude: ["username"],
      },
    ],
    where: {
      spotId: req.params.spotId,
    },
  });

  if (!reviews) {
    const err = new Error("Spot couldn't be found");
    err.status(404);
    return next(err);
  }

  const revImgs = await ReviewImage.scope("defaultScope").findAll();

  const results = { Reviews: [] };

  for (let review of reviews) {
    const rev = review.toJSON();
    rev.ReviewImages = [];
    for (let revImg of revImgs) {
      if (revImg["reviewId"] === rev.id) {
        rev.ReviewImages.push(revImg);
      }
    }
    results.Reviews.push(rev);
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
      userId: req.user.id,
      spotId: req.params.spotId,
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
    const newRevImg = await ReviewImage.create({
      reviewId: req.params.reviewId,
      url,
    });
    const retRev = {
      id: newRevImg["id"],
      url,
    };
    return res.json(retRev);
  }
);

// PUT Review by reviewId
router.put("/:reviewId", requireAuth, async (req, res) => {
  //
});

// DELETE Review by reviewId
router.delete("/:reviewId", requireAuth, async (req, res) => {
  //
});

module.exports = router;
