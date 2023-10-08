"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

// const spotIdsVisited = new Set();
// const userIdsVisited = new Set();
let demoReviewCount = 0;

const getRandNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
/* const buildSeed = () => {
  const spotId = getRandNum(20, 7);
  spotIdsVisited.add(spotId);
  const userId = getRandNum(10, 4);
  // userIdsVisited.add(userId);
  const review = `demoReview${demoReviewCount}`;
  const stars = getRandNum(5, 1);
  return {
    spotId,
    userId,
    review,
    stars,
  };
}; */

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
