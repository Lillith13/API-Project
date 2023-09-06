const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");

// GET ALL of currently signed in user's bookings
// --> Require Auth

// GET ALL bookings for spotId
// --> Require Auth
// --> different responses based on if you own the spot or not

// POST Booking for spotId
// --> Require Auth
// --> Cannot book for spots owned by currently signed in user

// EDIT Booking
// --> Require Auth
// --> Booking must belong to currently signed in user

// DELETE Booking
// --> Require Auth
// --> Booking must belong to currently signed in user

module.exports = router;
