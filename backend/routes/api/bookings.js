const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { requireAuth } = require("../../utils/auth.js");
const { bookingExists, spotExists } = require("../../utils/recordExists.js");
const {
  bookingConflicts,
  bodyValidation,
  editBookingErrChecks,
  delBookingErrChecks,
} = require("../../utils/bookingErrCheckers.js");
const { bookingBelongsToUser } = require("../../utils/belongsToUser.js");

const { Booking, Spot, SpotImage, User } = require("../../db/models");

// GET ALL of currently signed in user's bookings
router.get("/", requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
  });
  const spots = await Spot.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  const spotImgs = await SpotImage.findAll({
    where: {
      preview: true,
    },
    attributes: ["spotId", "url"],
  });

  let results = { Bookings: [] };
  for (let booking of bookings) {
    booking = booking.toJSON();
    for (let spot of spots) {
      if (booking.spotId === spot["id"]) {
        booking.Spot = spot;
        break;
      }
    }
    for (let spotImg of spotImgs) {
      if (booking.Spot["id"] == spotImg["spotId"]) {
        console.log(spotImg);
        booking.Spot.previewImage = spotImg["url"];
        console.log(booking.Spot);
        break;
      }
    }
    results.Bookings.push(booking);
  }

  return res.json(results);
});

// GET ALL bookings for spotId
router.get("/:spotId", [requireAuth, spotExists], async (req, res) => {
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
      exclude: ["userId", "createdAt", "updateAt"],
    },
  });
  const user = await User.scope("defaultScope").findByPk(req.user.id, {
    attributes: {
      exclude: ["username"],
    },
  });
  // --> different responses based on if you own the spot or not
  const results = { Bookings: [] };
  // Owned by currently signed in user:
  for (let ownedBooking of ownedBookings) {
    ownedBooking = ownedBooking.toJSON();
    ownedBooking.User = user;
    results.Bookings.push(ownedBooking);
  }
  // Not owned by signed in user:
  for (let otherBooking of otherBookings) {
    results.Bookings.push(otherBooking);
  }

  return res.json(results);
});

// POST Booking for spotId
router.post(
  "/:spotId",
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

// PUT Booking
router.put(
  "/:bookingId",
  [
    requireAuth,
    bookingExists,
    bookingBelongsToUser,
    bookingConflicts,
    bodyValidation,
    editBookingErrChecks,
  ],
  async (req, res) => {
    const { startDate, endDate } = req.body;
    const editBooking = await Booking.findByPk(req.params.bookingId);
    if (startDate) editBooking.startDate = startDate;
    if (endDate) editBooking.endDate = endDate;
    await editBooking.save();
    return res.json(editBooking);
  }
);

// DELETE Booking
router.delete(
  "/:bookingId",
  [requireAuth, bookingExists, bookingBelongsToUser, delBookingErrChecks],
  async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    try {
      await booking.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
