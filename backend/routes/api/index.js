const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");

const { restoreUser } = require("../../utils/auth.js");
// checks if user signed in or guest
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);

const { SpotImage, ReviewImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const {
  spotBelongsToUser,
  reviewBelongsToUser,
} = require("../../utils/belongsToUser");

// DELETE spot image
router.delete(
  "/spot-images/:imageId",
  [requireAuth, spotBelongsToUser],
  async (req, res) => {
    const spotImg = await SpotImage.findByPk(req.params.imgId);
    try {
      await spotImg.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

// DELETE review image
router.delete(
  "/review-images/:imgId",
  [requireAuth, reviewBelongsToUser],
  async (req, res) => {
    const revImg = await ReviewImage.findByPk(req.params.imgId);
    try {
      await revImg.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

// display available endpoints on start-up -> /api
router.get("/", async (req, res) => {
  const availableEndPointsList = {
    GET: {
      "/api": "displays all available endpoints W/ breif description",
      "/api/csrf/restore": "restores csrf token",
      "/api/session":
        "get currently signed in user -> displays null if no user signed in",
      "/api/spots": "get all spots",
      "/api/spots/:spotId": "get spots by spotId",
      "/api/spots/current":
        "returns all spots owned by the currently logged in user",
      "/api/reviews/current":
        "get all reviews written by currently signed in user",
      "/api/spots/:spotId/reviews": "get all reviews by spotId",
      "/api/bookings/current":
        "get all bookings belonging to currently signed in user",
      "/api/spots/:spotId/bookings": "get all bookings by spotId",
    },
    POST: {
      "/api/session": "user log-in route",
      "/api/users": "user sign-up route",
      "/api/spots": "creates new spot owned by the currently signed in user",
      "/api/spots/:spotId/images":
        "add image to spot owned by currently signed in user",
      "/api/spots/:spotId/reviews":
        "add a new review for specified spot(spotId)",
      "/api/reviews/:reviewId/images":
        "add new image to currently signed in user's posted reviews",
      "/api/spots/:spotId/bookings": "post new booking for specified spot",
    },
    PUT: {
      "/api/spots/:spotId":
        "edit spot owned by currently signed in user specified by spotId",
      "/api/reviews/:reviewId":
        "edit review written by currently signed in user specified by reviewId",
      "/api/bookings/:bookingId":
        "edit booking written by currently signed in user specified by bookingId",
    },
    DELETE: {
      "/api/spots/:spotId":
        "delete spot owned by currently signed in user specified by spotId",
      "/api/reviews/:reviewId":
        "delete review posted by currently signed in user specified by reviewId",
      "/api/bookings/:bookingId":
        "delete booking created by currently signed in user specified by bookingId",
      "/api/spot-images/:spotId/:imageId": "delete spot image by imgId",
      "/api/review-images/:reviewId/:imgId": "delete review image by imgId",
    },
  };
  // * add list of available tables (if can, when able)
  res.json(availableEndPointsList);
});

router.post("/test", function (req, res) {
  res.json({
    requestBody: req.body,
  });
});

module.exports = router;
