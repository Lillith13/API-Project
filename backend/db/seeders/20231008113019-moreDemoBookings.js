"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const getRandNum = (max, min) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
  // The maximum is inclusive and the minimum is inclusive
};

const monthsW31dys = [1, 3, 5, 7, 8, 10, 12];
const monthW29dys = 2;
const buildRandTimeFrame = () => {
  let startYear = getRandNum(2500, 2023);
  let endYear = getRandNum(2500, startYear);

  let startMonth = getRandNum(12, 1);
  let endMonth = getRandNum(12, startMonth);

  let startDay;
  let endDay;

  if (monthsW31dys.includes(startMonth)) {
    startDay = getRandNum(31, 1);
    endDay = getRandNum(31, startDay);
  } else if (startMonth === monthW29dys) {
    startDay = getRandNum(29, 1);
    endDay = getRandNum(29, startDay);
  } else {
    startDay = getRandNum(30, 1);
    endDay = getRandNum(30, startDay);
  }

  const startDate = `${startYear}-${startMonth}-${startDay}`;
  const endDate = `${endYear}-${endMonth}-${endDay}`;

  return {
    startDate,
    endDate,
  };
};

let bookingSeedCount = 0;
let bookingsCreated = new Set();
module.exports = {
  async up(queryInterface, Sequelize) {
    while (bookingSeedCount <= 30) {
      const { startDate, endDate } = buildRandTimeFrame();
      const spotId = getRandNum(15, 1);
      const userId = getRandNum(10, 4);
      const newBooking = {
        spotId,
        userId,
        startDate,
        endDate,
      };

      const booking = await Booking.create(newBooking);

      bookingSeedCount++;
      bookingsCreated.add(booking.id);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: {
          [Op.in]: [...bookingsCreated],
        },
      },
      {}
    );
  },
};
