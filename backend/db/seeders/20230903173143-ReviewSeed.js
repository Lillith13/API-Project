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
    userId: 2,
    review: "seededReview for seededSpot",
    stars: 2,
  },
  {
    spotId: 1,
    userId: 3,
    review: "seededReview for seededSpot",
    stars: 4,
  },
  {
    spotId: 2,
    userId: 1,
    review: "seededReview for seededSpot",
    stars: 5,
  },
  {
    spotId: 2,
    userId: 3,
    review: "seededReview for seededSpot",
    stars: 1,
  },
  {
    spotId: 3,
    userId: 1,
    review: "seededReview for seededSpot",
    stars: 3,
  },
  {
    spotId: 3,
    userId: 2,
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
