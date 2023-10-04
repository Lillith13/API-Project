const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { requireAuth } = require("../../utils/auth.js");
const { spotExists } = require("../../utils/recordExists.js");
const spotCreateErrorChecks = require("../../utils/spotErrorChecks");
const { spotBelongsToUser } = require("../../utils/belongsToUser.js");
const { queryValidation } = require("../../utils/queryValidation.js");
const { filterNpagi } = require("../../utils/filterNpagination.js");
const { postRevErrChecks } = require("../../utils/reviewErrorCheckers.js");
const {
  bookingConflicts,
  bodyValidation,
} = require("../../utils/bookingErrCheckers.js");

const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");

// get all spots
router.get("/", [queryValidation, filterNpagi], async (req, res) => {
  const { where, pagination } = req;

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
    const price = spotses.price;
    spotses.price = Number(price).toFixed(2);
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
  }

  results.page = Number(req.query.page) || 1;
  results.size = Number(req.query.size) || 20;

  return res.json(results);
});

// get spots owned by logged in user
router.get("/current", requireAuth, async (req, res) => {
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

  if (userSpots.id === null || userSpots.length === 0) {
    return res.json({
      message: "You currently do not own any spots",
    });
  }

  const results = { Spots: [] };
  for (let spot of userSpots) {
    let spotses = spot.toJSON();
    const price = spotses.price;
    spotses.price = Number(price).toFixed(2);
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
  const price = result.price;
  result.price = Number(price).toFixed(2);
  result.numReviews = reviewsForLength.length;
  result.avgStarRating = spotReviews[0].dataValues.avgRating.toFixed(2);
  result.SpotImages = spotImages;
  result.Owner = ownerInfo;
  return res.json(result);
});

// create new spot
router.post("/", [requireAuth, spotCreateErrorChecks], async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
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
    price: Number(price).toFixed(2),
  });
  return res.status(201).json(newSpot);
});

// add image to spot
router.post(
  "/:spotId/images",
  [requireAuth, spotExists, spotBelongsToUser],
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
      attributes: {
        exclude: ["spotId", "createdAt", "updatedAt"],
      },
    });
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
    const results = {
      id: newSpotImg.id,
      url,
      preview,
    };
    return res.json(results);
  }
);

// edit a spot
router.put(
  "/:spotId",
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
  "/:spotId",
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

// GET ALL Reviews by spotId
router.get("/:spotId/reviews", spotExists, async (req, res) => {
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
  "/:spotId/reviews",
  [requireAuth, spotExists, postRevErrChecks],
  async (req, res) => {
    const { review, stars } = req.body;
    const newReview = await Review.create({
      spotId: Number(req.params.spotId),
      userId: req.user.id,
      review,
      stars,
    });
    return res.json(newReview);
  }
);

router.get("/:spotId/bookings", [requireAuth, spotExists], async (req, res) => {
  const ownedBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
      spotId: req.params.spotId,
    },
  });
  const otherBookings = await Booking.findAll({
    where: {
      userId: {
        [Op.not]: req.user.id,
      },
      spotId: req.params.spotId,
    },
    attributes: {
      exclude: ["id", "userId", "createdAt", "updatedAt"],
    },
  });
  const user = await User.scope("defaultScope").findByPk(req.user.id, {
    attributes: {
      exclude: ["username"],
    },
  });
  // --> different responses based on if user owns the spot or not
  const results = { Bookings: [] };
  // Owned by currently signed in user:
  for (let ownedBooking of ownedBookings) {
    ownedBooking = ownedBooking.toJSON();

    const startDate = ownedBooking.startDate;
    const endDate = ownedBooking.endDate;

    let year = startDate.getFullYear();
    let month = startDate.getMonth() + 1;
    let day = startDate.getDate();
    ownedBooking.startDate = `${year}-${month}-${day}`;

    year = endDate.getFullYear();
    month = endDate.getMonth() + 1;
    day = endDate.getDate();
    ownedBooking.endDate = `${year}-${month}-${day}`;

    ownedBooking.User = user;

    results.Bookings.push(ownedBooking);
  }
  // Not owned by signed in user:
  for (let otherBooking of otherBookings) {
    otherBooking = otherBooking.toJSON();

    const startDate = otherBooking.startDate;
    const endDate = otherBooking.endDate;

    let year = startDate.getFullYear();
    let month = startDate.getMonth() + 1;
    let day = startDate.getDate();
    otherBooking.startDate = `${year}-${month}-${day}`;

    year = endDate.getFullYear();
    month = endDate.getMonth() + 1;
    day = endDate.getDate();
    otherBooking.endDate = `${year}-${month}-${day}`;

    results.Bookings.push(otherBooking);
  }

  return res.json(results);
});

// POST Booking for spotId
router.post(
  "/:spotId/bookings",
  [requireAuth, spotExists, bookingConflicts, bodyValidation],
  async (req, res) => {
    const { startDate, endDate } = req.body;
    const newBooking = await Booking.create({
      spotId: req.params.spotId,
      userId: req.user.id,
      startDate,
      endDate,
    });
    return res.json(newBooking);
  }
);

module.exports = router;
