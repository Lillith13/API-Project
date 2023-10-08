const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { requireAuth } = require("../../utils/auth.js");
const { bookingExists } = require("../../utils/recordExists.js");
const {
  bookingConflicts,
  bodyValidation,
  editBookingErrChecks,
  delBookingErrChecks,
} = require("../../utils/bookingErrCheckers.js");
const { bookingBelongsToUser } = require("../../utils/belongsToUser.js");

const { Booking, Spot, SpotImage } = require("../../db/models");

// GET ALL of currently signed in user's bookings
router.get("/current", requireAuth, async (req, res) => {
  const Bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
      include: {
        model: SpotImage,
        where: {
          preview: true,
        },
        attributes: ["url"],
        as: "previewImage",
      },
    },
  });

  return res.json({ Bookings });
});

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
