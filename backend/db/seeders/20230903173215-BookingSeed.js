"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../models");

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
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookingSeed, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(
      options,
      {
        spotId: 1,
      },
      {}
    );
  },
};
