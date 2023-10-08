"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Review, ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const getRandNum = (max, min) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
  // The maximum is inclusive and the minimum is inclusive
};

async function buildRevImages() {
  const reviewCount = await Review.count();
  const revImgArr = [];
  let revImgSeedCount = 0;

  while (revImgSeedCount <= reviewCount * 3) {
    const reviewId = getRandNum(reviewCount * 3, 1);
    const url = `reviewImageDemoUrl${revImgSeedCount}`;

    revImgArr.push({
      reviewId,
      url,
    });

    revImgSeedCount++;
  }
  await ReviewImage.bulkCreate(revImgArr);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    buildRevImages();
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
