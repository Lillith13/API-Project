const { Booking } = require("../db/models");
const { Op } = require("sequelize");

async function bookingConflicts(req, _res, next) {
  const { startDate, endDate } = req.body;
  let spotId;
  let bookingId;
  let booking;

  if (req.params.spotId) {
    spotId = req.params.spotId;
  } else {
    bookingId = req.params.bookingId;
    booking = await Booking.findByPk(bookingId);
    spotId = booking.spotId;
  }

  let err = new Error("Booking Conflict");
  err.errors = {};
  let errTriggered = false;

  // query all bookings for spot by spotId
  const bookings = await Booking.findAll({
    where: {
      spotId,
    },
  });

  /* v queried bookings.ids NOT equal to a provided bookingId will be tested against, if they do equal tests will be skipped, allowing for editing but also preventing booking conflicts --- no bookingId provided bookingId === 0 v */

  if (bookings) {
    for (let booking of bookings) {
      // if start date falls on or between existing booking dates
      if (bookingId != "undefined" && bookingId != booking.id) {
        if (
          (booking.startDate > startDate && booking.startDate < endDate) ||
          booking.startDate === startDate ||
          (booking.startDate < startDate && booking.endDate > startDate) ||
          booking.endDate === startDate
        ) {
          err.errors.startDate =
            "Start date conflicts with an existing booking";
          errTriggered = true;
        }
        // if send date falls on or between existing booking dates
        if (
          booking.startDate === endDate ||
          (booking.startDate < endDate && booking.endDate > endDate) ||
          booking.endDate === endDate ||
          (booking.endDate > startDate && booking.endDate < endDate)
        ) {
          err.errors.endDate = "End date conflicts with an existing booking";
          errTriggered = true;
        }
        // if existing booking falls between desired booking dates
        if (booking.startDate > startDate && booking.endDate < endDate) {
          err.errors.startDate =
            "Start date conflicts with an existing booking";
          err.errors.endDate = "End date conflicts with an existing booking";
          errTriggered = true;
        }
      }
    }
  }

  if (errTriggered) {
    err.message = "Sorry, this spot is already booked for the specified dates";
    err.status = 403;
    next(err);
  }
  next();
}

async function bodyValidation(req, _res, next) {
  const { startDate, endDate } = req.body;

  if (endDate < startDate || endDate === startDate) {
    let err = new Error("Booking Conflict");
    err.errors = {};
    err.status = 400;
    err.message = "Bad Request";
    err.errors.endDate = "endDate cannot be on or before startDate";
    next(err);
  }

  next();
}

async function editBookingErrChecks(req, _res, next) {
  const booking = await Booking.findByPk(req.params.bookingId, {
    attributes: ["endDate"],
  });
  if (Date.now() > booking["endDate"]) {
    let err = new Error("Booking Conflict");
    err.message = "Past bookings can't be modified";
    err.status = 403;
    next(err);
  }
  next();
}

async function delBookingErrChecks(req, _res, next) {
  const booking = await Booking.findByPk(req.params.bookingId, {
    attributes: ["startDate"],
  });
  if (Date.now() > booking["startDate"]) {
    let err = new Error("Booking Conflict");
    err.errors = {};
    err.status = 403;
    err.message = "Bookings that have been started can't be deleted";
    next(err);
  }
  next();
}

module.exports = {
  bookingConflicts,
  bodyValidation,
  editBookingErrChecks,
  delBookingErrChecks,
};
