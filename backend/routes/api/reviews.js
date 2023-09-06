const express = require("express");
const router = express.Router();

const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

// GET ALL Reviews
router.get("/", async (req, res) => {
  const reviews = await Review.scope("defaultScope").findAll({
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
router.get("/spot/:spotId", async (req, res) => {
  //
});

// POST Review -> Spot by spotId
router.post("/spot/:spotId", async (req, res) => {
  //
});

// POST Image -> Review by reviewId
router.post("/:reviewId", async (req, res) => {
  //
});

// PUT Review by reviewId
router.put("/:reviewId", async (req, res) => {
  //
});

// DELETE Review by reviewId
router.delete("/:reviewId", async (req, res) => {
  //
});

module.exports = router;
