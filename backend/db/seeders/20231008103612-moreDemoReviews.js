"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

let demoReviewCount = 0;

const getRandNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
  async up(queryInterface, Sequelize) {
    while (demoReviewCount <= 30) {
      const newReview = {
        spotId: getRandNum(20, 7),
        userId: getRandNum(10, 4),
        review: `demoReview${demoReviewCount}`,
        stars: getRandNum(5, 1),
      };
      await Review.create(newReview);
      demoReviewCount++;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        review: {
          [Op.startsWith]: "demoReview",
        },
      },
      {}
    );
  },
};
