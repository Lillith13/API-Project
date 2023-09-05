"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const reviewSeed = [
  {
    spotId: 1,
    userId: 1,
    review: "seededReview for seededSpot",
    stars: 3,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(reviewSeed, {
      validate: true,
    });
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
