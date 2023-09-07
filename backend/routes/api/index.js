const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const imagesRouter = require("./images.js");

const { restoreUser } = require("../../utils/auth.js");
// checks if user signed in or guest
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);
router.use("/images", imagesRouter);

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
      "/api/spots/mySpots":
        "returns all spots owned by the currently logged in user",
      "/api/reviews": "get all reviews written by currently signed in user",
      "/api/reviews/:spotId": "get all reviews by spotId",
      "/api/bookings": "get all bookings belonging to currently signed in user",
      "/api/bookings/:spotId": "get all bookings by spotId",
    },
    POST: {
      "/session": "user log-in route",
      "/users": "user sign-up route",
      "/spots/mySpots":
        "creates new spot owned by the currently signed in user",
      "/spots/mySpots/:spotId":
        "add image to spot owned by currently signed in user",
      "/api/reviews/spot/:spotId":
        "add a new review for specified spot(spotId)",
      "/api/reviews/:reviewId":
        "add new image to currently signed in user's posted reviews",
      "/api/bookings/:spotId": "post new booking for specified spot",
    },
    PUT: {
      "/api/spots/mySpots/:spotId":
        "edit spot owned by currently signed in user specified by spotId",
      "/api/reviews/:reviewId":
        "edit review written by currently signed in user specified by reviewId",
      "/api/bookings/:bookingId":
        "edit booking written by currently signed in user specified by bookingId",
    },
    DELETE: {
      "/api/spots/mySpots/:spotId":
        "delete spot owned by currently signed in user specified by spotId",
      "/api/reviews/:reviewId":
        "delete review posted by currently signed in user specified by reviewId",
      "/api/bookings/:bookingId":
        "delete booking created by currently signed in user specified by bookingId",
      "/api/images/spot/:spotId/:imgId": "delete spot image by imgId",
      "/api/images/review/:reviewId/:imgId": "delete review image by imgId",
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
