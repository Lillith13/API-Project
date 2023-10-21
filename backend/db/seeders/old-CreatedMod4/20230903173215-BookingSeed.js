"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const bookingSeed = [
  {
    spotId: 1,
    userId: 2,
    startDate: "12/15/2023",
    endDate: "12/30/2023",
  },
  {
    spotId: 1,
    userId: 3,
    startDate: "11/30/2023",
    endDate: "12/14/2023",
  },
  {
    spotId: 2,
    userId: 1,
    startDate: "10/30/2023",
    endDate: "11/15/2023",
  },
  {
    spotId: 2,
    userId: 3,
    startDate: "11/30/2023",
    endDate: "12/15/2023",
  },
  {
    spotId: 3,
    userId: 1,
    startDate: "11/30/2023",
    endDate: "12/14/2023",
  },
  {
    spotId: 3,
    userId: 2,
    startDate: "01/15/2024",
    endDate: "02/20/2024",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookingSeed, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(
      options,
      {
        spotId: 1,
      },
      {}
    );
  },
};
