"use strict";

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const reviewImgSeed = [
  {
    reviewId: 1,
    url: "seedReview1Image.url",
  },
  {
    reviewId: 2,
    url: "seedReview2Image.url",
  },
  {
    reviewId: 3,
    url: "seedReview3Image.url",
  },
  {
    reviewId: 4,
    url: "seedReview4Image.url",
  },
  {
    reviewId: 5,
    url: "seedReview5Image.url",
  },
  {
    reviewId: 6,
    url: "seedReview6Image.url",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImgSeed, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: {
          [Op.between]: [0, 8],
        },
      },
      {}
    );
  },
};
