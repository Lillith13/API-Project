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
        exclude: ["updatedAt", "createdAt"]
      },
      include: {
        model: Image,
        as: "previewImage",
        where: {
          preview: true
        },
        attributes: ["url"]
      }
    }
  });
  // const spots = await Spot.findAll({
  //   attributes: {
  //     exclude: ["description", "createdAt", "updatedAt"],
  //   },
  // });
  // const spotImgs = await SpotImage.findAll({
  //   where: {
  //     preview: true,
  //   },
  //   attributes: ["spotId", "url"],
  // });

  // let results = { Bookings: [] };
  // for (let booking of bookings) {
    /* booking = booking.toJSON();
    const startDate = booking.startDate;
    const endDate = booking.endDate;

    let year = startDate.getFullYear();
    let month = startDate.getMonth() + 1;
    let day = startDate.getDate();
    booking.startDate = `${year}-${month}-${day}`;

    year = endDate.getFullYear();
    month = endDate.getMonth() + 1;
    day = endDate.getDate();
    booking.endDate = `${year}-${month}-${day}`; */

    /* for (let spot of spots) {
      if (booking.spotId === spot["id"]) {
        booking.Spot = spot.dataValues;
        break;
      }
    }
    for (let spotImg of spotImgs) {
      if (booking.Spot["id"] == spotImg["spotId"]) {
        booking.Spot.previewImage = spotImg["url"];
        break;
      }
    } */
    // results.Bookings.push(booking);
  // }

  return res.json(Bookings);
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
