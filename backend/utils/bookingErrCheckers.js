const { Booking } = require("../db/models");
const { Op } = require("sequelize");

async function bookingConflicts(req, _res, next) {
  const { startDate, endDate } = req.body;

  let spotId
  if(req.params.spotId) spotId = req.params.spotId
  else {
    const booking = await Booking.findByPk(req.params.bookingId)
    spotId = booking.spotId
  }


  let err = new Error("Booking Conflict");
  err.errors = {};
  let errTriggered = false;

  const bookingSD = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        { startDate },
      ],
    },
  });
  const bookingED = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        { endDate },
      ],
    },
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

  const sYear = startDate.split('/')[2]
  const sMonth = startDate.split('/')[0]
  const sDay = startDate.split('/')[1]

  const eYear = endDate.split('/')[2]
  const eMonth = endDate.split('/')[0]
  const eDay = endDate.split('/')[1]

  if (sYear > eYear || (sYear <= eYear && sMonth > eMonth) || (sYear <= eYear && sMonth <= eMonth && sDay > eDay)) {
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
