/* --- BoilerPlate --- */
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// security middleware
if (!isProduction) {
  app.use(cors());
}

// enable helmet middleware to set a variety of headers for better security
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// create csurf middleware to set _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "lax",
      httpOnly: true,
    },
  })
);

const routes = require("./routes");
app.use(routes); //collect all routes

// display available endpoints on start-up
app.get("/", async (req, res) => {
  const availableEndPointsList = {
    GET: {
      "/api": "displays all available endpoints W/ brief description",
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
      "/api/session": "user log-out route",
      "/api/spots/:spotId":
        "delete spot owned by currently signed in user specified by spotId",
      "/api/reviews/:reviewId":
        "delete review posted by currently signed in user specified by reviewId",
      "/api/bookings/:bookingId":
        "delete booking created by currently signed in user specified by bookingId",
      "/api/spot-images/:imageId": "delete spot image by imgId",
      "/api/review-images/:imageId": "delete review image by imgId",
    },
  };

  const availableTables = [
    "Users",
    "Spots",
    "SpotImages",
    "Reviews",
    "ReviewImages",
    "Bookings",
  ];

  res.json({
    availableEndPointsList,
    availableTables,
  });
});

// catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

const { ValidationError } = require("sequelize");

// process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a sequelize error
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

// error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.log(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors, // {}
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
