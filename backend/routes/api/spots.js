const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { requireAuth } = require("../../utils/auth.js");

const { Spot, Review, SpotImage, User } = require("../../db/models");
const spotCreateErrorChecks = require("../../utils/spotErrorChecks");

// get all spots
router.get("/", async (req, res) => {
  const Spots = await Spot.findAll({
    // ! Current structure of what's returned is fine for now, but will take extra work on the front end to pull the values i want up out of the object
    include: [
      {
        model: SpotImage,
        as: "previewImage",
        attributes: ["id", "url"],
        where: {
          preview: true,
        },
        // group: "previewImage.id",
      },
      {
        model: Review,
        // as: "avgRating", // * <- alias does work
        attributes: [
          "id",
          // ! grabs all of the ratings for each spot hit on this query and averages their stars returning them under the "column" name avgRating <-- still displays as nested within Reviews
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
        ],
      },
    ],
    group: ["Spot.id", "previewImage.id", "Reviews.id"],
  });
  return res.json({ Spots });
});

// get spots owned by logged in user
router.get("/mySpots", requireAuth, async (req, res) => {
  const userSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
    // ! Current structure of what's returned is fine for now, but will take extra work on the front end to pull the values i want up out of the object
    include: [
      {
        model: SpotImage,
        as: "previewImage",
        attributes: ["id", "url"],
        where: {
          preview: true,
        },
        // group: "previewImage.id",
      },
      {
        model: Review,
        // as: "avgRating", // * <- alias does work
        attributes: [
          "id",
          // ! grabs all of the ratings for each spot hit on this query and averages their stars returning them under the "column" name avgRating <-- still displays as nested within Reviews
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
        ],
      },
    ],
    group: ["Spot.id", "previewImage.id", "Reviews.id"],
  });
  if (userSpots.id == null) {
    // * If user doesn't have any spots, return message --- will only work/catch if there is only one entry in the array returned and it's id is equal to null
    return res.json({
      message: "You currently do not own any spots",
    });
  }
  return res.json(userSpots);
});

// get spot by it's id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review,
        // ! COUNT reviews & return as numReviews
        // ! gather stars & return as avgStarRating
      },
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner", // ! reset db & test alias
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });
  if (!spot) return res.json({ message: "Spot couldn't be found" });
  return res.json(spot);
});

// create new spot
router.post(
  "/mySpots",
  [requireAuth, spotCreateErrorChecks],
  async (req, res) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    return res.json(newSpot);
  }
);

// add image to spot
router.post("/mySpots/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const { url, preview } = req.body;
  const newSpotImg = await SpotImage.create({
    spotId: req.params.spotId,
    url,
    preview,
  });
  return res.json(newSpotImg);
});

// edit a spot
router.put(
  "/mySpots/:spotId",
  [spotCreateErrorChecks, requireAuth],
  async (req, res) => {
    // ! spotCreateErrorChecks requires for ALL attributes to be edited -> create new check for editing a spot to allow for individual attribute editing
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if (address) spot.address = address;
    if (city) spot.city = city;
    if (state) spot.state = state;
    if (country) spot.country = country;
    if (lat) spot.lat = lat;
    if (lng) spot.lng = lng;
    if (name) spot.name = name;
    if (description) spot.description = description;
    if (price) spot.price = price;
    await spot.save();
    return res.json(spot);
  }
);

// delete spot owned by currently signed in user
router.delete("/mySpots/:spotId", requireAuth, async (req, res) => {
  const delSpot = await Spot.findByPk(req.params.spotId);
  if (req.user.id !== delSpot.ownerId) {
    // * if currently logged in user or guest attempts to delete another users spot
    return res.json({
      message: "You cannot delete spots that don't belong to you",
    });
  }
  try {
    await delSpot.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
