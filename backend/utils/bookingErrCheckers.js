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
  const bookedStartYear = bookedStart.getFullYear();
  const bookedStartMonth = bookedStart.getMonth();
  const bookedStartDay = bookedStart.getDate();

  const bookedEnd = booking["endDate"];
  const bookedEndYear = bookedEnd.getFullYear();
  const bookedEndMonth = bookedEnd.getMonth();
  const bookedEndDay = bookedEnd.getDate();

  if (booking) {
    if (
      bookedStartYear === Number(startDate.split("/")[2]) ||
      bookedEndYear === Number(endDate.split("/")[2])
    ) {
      // if desired startDate falls within an already booked timeframe
      if (
        Number(startDate.split("/")[0]) >= bookedStartMonth &&
        Number(startDate.split("/")[1]) >= bookedStartDay &&
        Number(startDate.split("/")[0]) <= bookedEndMonth &&
        Number(startDate.split("/")[1]) <= bookedEndDay
      ) {
        err.errors.startDate = "Start date conflicts with an existing booking";
        errTriggered = true;
      }
      // if desired endDate falls within an already booked timeFrame
      if (
        Number(endDate.split("/")[0]) >= bookedStartMonth &&
        Number(endDate.split("/")[1]) >= bookedStartDay &&
        Number(endDate.split("/")[0]) <= bookedEndMonth &&
        Number(endDate.split("/")[1]) <= bookedEndDay
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
