"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot, Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const randomNum = (min, max) => {
  const randNum = Math.floor(Math.random() * (max - min + 1) + min);
  return randNum;
};
const today = new Date();
const todayObj = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};
const randStartDate = () => {
  const randYear = randomNum(todayObj.year, 2035);

  const randMonth = randomNum(1, 12);

  let randDay;
  if (
    randMonth === 4 ||
    randMonth === 6 ||
    randMonth === 9 ||
    randMonth === 11
  ) {
    randDay = randomNum(1, 30);
  } else if (
    randMonth === 2 &&
    (randYear === 2024 || randYear === 2028 || randYear === 2032)
  ) {
    randDay = randomNum(1, 29);
  } else if (randMonth === 2) {
    randDay = randomNum(1, 28);
  } else {
    randDay = randomNum(1, 31);
  }
  const randStartDate = `${randYear}-${randMonth}-${randDay}`;

  return randStartDate;
};
const randEndDate = (startDate) => {
  const startDateArr = startDate.split("-");
  const sdYear = startDateArr[0];
  const sdMonth = startDateArr[1];
  const sdDay = startDateArr[2];

  const randYear = randomNum(Number(sdYear), 2035);

  let randMonth;
  randYear === sdYear
    ? (randMonth = randomNum(sdMonth, 12))
    : (randMonth = randomNum(1, 12));

  let randDay;
  if (randMonth === sdMonth) {
    if (
      randMonth === 4 ||
      randMonth === 6 ||
      randMonth === 9 ||
      randMonth === 11
    ) {
      randDay = randomNum(sdDay, 30);
    } else if (
      randMonth === 2 &&
      (randYear === 2024 || randYear === 2028 || randYear === 2032)
    ) {
      randDay = randomNum(sdDay, 29);
    } else if (randMonth === 2) {
      randDay = randomNum(sdDay, 28);
    } else {
      randDay = randomNum(sdDay, 31);
    }
  } else {
    if (
      randMonth === 4 ||
      randMonth === 6 ||
      randMonth === 9 ||
      randMonth === 11
    ) {
      randDay = randomNum(1, 30);
    } else if (
      randMonth === 2 &&
      (randYear === 2024 || randYear === 2028 || randYear === 2032)
    ) {
      randDay = randomNum(1, 29);
    } else if (randMonth === 2) {
      randDay = randomNum(1, 28);
    } else {
      randDay = randomNum(1, 31);
    }
  }
  const randEndDate = `${randYear}-${randMonth}-${randDay}`;

  return randEndDate;
};

const buildDemoBookings = async () => {
  const demoBookings = [];
  const users = await User.findAll({
    attributes: ["id"],
  });
  const spots = await Spot.findAll({
    attributes: ["id", "ownerId"],
  });
  spots.forEach((spot) => {
    users.forEach((user) => {
      const startDate = randStartDate();
      const endDate = randEndDate(startDate);
      if (spot.ownerId !== user.id) {
        demoBookings.push({
          spotId: spot.id,
          userId: user.id,
          startDate,
          endDate,
        });
      }
    });
  });
  return demoBookings;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoBookings = await buildDemoBookings();
    await Booking.bulkCreate(demoBookings, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // TBD
    });
  },
};
