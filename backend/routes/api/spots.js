const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { requireAuth } = require("../../utils/auth.js");
const { spotExists } = require("../../utils/recordExists.js");
const spotCreateErrorChecks = require("../../utils/spotErrorChecks");
const { spotBelongsToUser } = require("../../utils/belongsToUser.js");
const { queryValidation } = require("../../utils/queryValidation.js");

const { Spot, Review, SpotImage, User } = require("../../db/models");

// get all spots
router.get("/", queryValidation, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  if (!page || isNaN(page) || page >= 11) page = 1;
  if (!size || isNaN(size) || size >= 21) size = 20;

  const pagination = {
    limit: size,
    offset: (page - 1) * size,
  };

  const where = {};

  if (minLat && maxLat) where.lat = { [Op.between]: [minLat, maxLat] };
  else if (minLat && !maxLat) where.lat = { [Op.gte]: minLat };
  else if (maxLat && !minLat) where.lat = { [Op.lte]: maxLat };

  if (minLng && maxLng) where.lng = { [Op.between]: [minLng, maxLng] };
  else if (minLng && !maxLng) where.lng = { [Op.gte]: minLng };
  else if (maxLng && !minLng) where.lng = { [Op.lte]: maxLng };

  if (minPrice && maxPrice)
    where.price = { [Op.between]: [minPrice, maxPrice] };
  else if (minPrice && !maxPrice) where.price = { [Op.gte]: minPrice };
  else if (maxPrice && !minPrice) where.price = { [Op.lte]: maxPrice };

  const Spots = await Spot.findAll({
    where,
    ...pagination,
  });

  const SpotImages = await SpotImage.findAll({
    attributes: ["spotId", "url"],
    where: {
      preview: true,
    },
  });

  const Reviews = await Review.findAll({
    attributes: [
      "spotId",
      [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
    ],
    group: ["Review.spotId"],
  });

  const results = { Spots: [] };
  for (let spot of Spots) {
    let spotses = spot.toJSON();
    for (let review of Reviews) {
      if (review["spotId"] === spotses.id) {
        review = review.toJSON();
        spotses.avgRating = review.avgRating;
      }
    }
    for (let spotImg of SpotImages) {
      if (spotImg["spotId"] === spotses.id) {
        spotses.previewImage = spotImg["url"];
      }
    }
    results.Spots.push(spotses);
    results.page = Number(page);
    results.size = Number(size);
  }
  return res.json(results);
});

// get spots owned by logged in user
router.get("/mySpots", requireAuth, async (req, res) => {
  const userSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  const userSpotsImages = await SpotImage.findAll({
    attributes: ["spotId", "url"],
    where: {
      preview: true,
    },
  });
  const userSpotsReviews = await Review.findAll({
    attributes: [
      "spotId",
      [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
    ],
    group: "Review.spotId",
  });
  if (userSpots.id === null) {
    // * If user doesn't have any spots, return message --- will only work/catch if there is only one entry in the array returned and it's id is equal to null
    return res.json({
      message: "You currently do not own any spots",
    });
  }
  const results = { Spots: [] };
  for (let spot of userSpots) {
    let spotses = spot.toJSON();
    for (let review of userSpotsReviews) {
      if (review["spotId"] === spotses.id) {
        review = review.toJSON();
        spotses.avgRating = review.avgRating;
      }
    }
    for (let spotImg of userSpotsImages) {
      if (spotImg["spotId"] === spotses.id) {
        spotses.previewImage = spotImg["url"];
      }
    }
    results.Spots.push(spotses);
  }
  return res.json(results);
});

// get spot by it's id
router.get("/:spotId", spotExists, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const spotImages = await SpotImage.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: ["id", "url", "preview"],
  });
  const spotReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: [[Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"]],
  });
  const reviewsForLength = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
  });
  const ownerInfo = await User.findOne({
    where: {
      id: spot["ownerId"],
    },
    attributes: ["id", "firstName", "lastName"],
  });

  const result = spot.toJSON();
  result.numReviews = reviewsForLength.length;
  result.avgStarRating = spotReviews[0].dataValues.avgRating;
  result.SpotImages = spotImages;
  result.Owner = ownerInfo;
  return res.json(result);
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
    return res.status(201).json(newSpot);
  }
);

// add image to spot
router.post(
  "/mySpots/:spotId",
  [requireAuth, spotExists, spotBelongsToUser],
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (req.user.id !== spot.ownerId) {
      const err = new Error("Spot doesn't belong to you");
      err.status = 200;
      return next(err);
    }
    const { url, preview } = req.body;
    const newSpotImg = await SpotImage.create({
      spotId: req.params.spotId,
      url,
      preview,
    });
    return res.json(newSpotImg);
  }
);

// edit a spot
router.put(
  "/mySpots/:spotId",
  [requireAuth, spotExists, spotBelongsToUser, spotCreateErrorChecks],
  async (req, res, next) => {
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
    if (req.user.id !== spot.ownerId) {
      const err = new Error("Spot doesn't belong to you");
      err.status = 200;
      return next(err);
    }

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
router.delete(
  "/mySpots/:spotId",
  [requireAuth, spotExists, spotBelongsToUser],
  async (req, res) => {
    const delSpot = await Spot.findByPk(req.params.spotId);
    try {
      await delSpot.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
