"use strict";

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

let revImgSeedCount = 0;

const getRandNum = (max, min) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
  // The maximum is inclusive and the minimum is inclusive
};

module.exports = {
  async up(queryInterface, Sequelize) {
    while (revImgSeedCount <= 20) {
      const reviewImageSeed = {
        reviewId: getRandNum(30, 1),
        url: `reviewImageDemoUrl${revImgSeedCount}`,
      };
      await ReviewImage.create(reviewImageSeed);
      revImgSeedCount++;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        review: {
          [Op.startsWith]: "reviewImageDemoUrl",
        },
      },
      {}
    );
  },
};
