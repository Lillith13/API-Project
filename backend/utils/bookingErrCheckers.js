const { Booking } = require("../db/models");
const { Op } = require("sequelize");
async function bookingConflicts(req, _res, next) {
  const { startDate, endDate } = req.body;
  let err = new Error("Booking Conflict");
  err.errors = {};
  let errTriggered = false;
  const booking = await Booking.findByPk(req.params.spotId, {
    where: {
      [Op.between]: [startDate, endDate],
    },
    attributes: ["startDate", "endDate"],
  });

  const bookedStart = booking["startDate"];
  const startYear = bookedStart.getFullYear();
  const startMonth = bookedStart.getMonth();
  const startDay = bookedStart.getDate();

  const bookedEnd = booking["endDate"];
  const endYear = bookedEnd.getFullYear();
  const endMonth = bookedEnd.getMonth();
  const endDay = bookedEnd.getDate();

  if (booking) {
    if (
      startYear === startDate.getFullYear() ||
      endYear === endDate.getFullYear()
    ) {
      // if desired startDate falls within an already booked timeframe
      if (
        startDate.getMonth() >= startMonth &&
        startDate.getDate() >= startDay &&
        startDate.getMonth() <= endMonth &&
        startDate.getDate() <= endDay
      ) {
        err.errors.startDate = "Start date conflicts with an existing booking";
        errTriggered = true;
      }
      // if desired endDate falls within an already booked timeFrame
      if (
        endDate.getMonth() >= startMonth &&
        endDate.getDate() >= startDay &&
        endDate.getMonth() <= endMonth &&
        endDate.getDate() <= endDay
      ) {
        err.errors.endDate = "End date conflicts with an existing booking";
        errTriggered = true;
      }
    }
  }

  if (errTriggered) {
    err.message =
      "Sorry, this spot is already booked for the specified dates, please check the spot's listed bookings and choose a timeframe outside of what has already been booked.";
    err.status = 403;
    next(err);
  }
  next();
}

async function bodyValidation(req, _res, next) {
  const { startDate, endDate } = req.body;
  if (endDate <= startDate) {
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
