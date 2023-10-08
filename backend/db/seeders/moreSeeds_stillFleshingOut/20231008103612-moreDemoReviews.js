"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot, Review } = require("../../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const getRandNum = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

async function buildReviews() {
  let demoReviewCount = 0;
  const spotCount = await Spot.count();
  const userCount = await User.count();
  const newReviewsArr = [];

  while (demoReviewCount <= spotCount / 2 - userCount) {
    const spotId = getRandNum(spotCount / 2 - userCount, 1);
    const userId = getRandNum(userCount, 1);
    const review = `demoReview${demoReviewCount}`;
    const stars = getRandNum(5, 1);
    newReviewsArr.push({
      spotId,
      userId,
      review,
      stars,
    });
    demoReviewCount++;
  }

  await Review.bulkCreate(newReviewsArr);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i <= 5; i++) {
      buildReviews();
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
