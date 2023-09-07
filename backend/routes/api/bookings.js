const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");

// GET ALL of currently signed in user's bookings
router.get("/", async (req, res) => {
  // --> Require Auth
  //
});

// GET ALL bookings for spotId
router.get("/:spotId", async (req, res) => {
  // --> Require Auth
  // --> different responses based on if you own the spot or not
  // -> spotExists
  //
});

// POST Booking for spotId
router.post("/:spotId", async (req, res) => {
  // --> Require Auth
  // --> Spot must NOT belong to the current user
  // -> endDate cannot be on or before startDate
  // -> spotExists
  /* Booking conflict
        {
          "message": "Sorry, this spot is already booked for the specified dates",
          "errors": {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
          }
        }
    */
  //
});

// PUT Booking
router.put("/:bookingId", async (req, res) => {
  // --> Require Auth
  // --> Booking must belong to currently signed in user
  // -> endDate cannot come before startDate
  // -> bookingExists
  // -> Past bookings can't be modified
  /* Booking conflict
        {
          "message": "Sorry, this spot is already booked for the specified dates",
          "errors": {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
          }
        }
    */
  //
});

// DELETE Booking
router.delete("/:bookingId", async (req, res) => {
  // --> Require Auth
  // --> Booking must belong to currently signed in user
  // --> Spot must belong to the currently signed in user
  // -> bookingExists
  // -> Bookings that have been started can't be deleted
  //
});

module.exports = router;
