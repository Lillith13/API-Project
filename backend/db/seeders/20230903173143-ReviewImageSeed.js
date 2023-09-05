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
    url: "reviewImage-url",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImgSeed, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: 1,
      },
      {}
    );
  },
};
