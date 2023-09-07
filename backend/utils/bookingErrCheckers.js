const { Booking } = require("../db/models");

async function bookingConflicts(req, _res, next) {
  const { startDate, endDate } = req.body;
  let err = new Error("Booking Conflict");
  err.errors = {};
  let errTriggered = false;
  const bookingSD = await Booking.findOne({
    where: {
      startDate,
    },
    attributes: ["startDate"],
  });
  const bookingED = await Booking.findOne({
    where: {
      endDate,
    },
    attributes: ["endDate"],
  });
  if (bookingSD) {
    err.errors.startDate = "Start date conflicts with an existing booking";
    errTriggered = true;
  }
  if (bookingED) {
    err.errors.endDate = "End date conflicts with an existing booking";
    errTriggered = true;
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
  const { endDate } = req.body;
  if (Date.now() > endDate) {
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
