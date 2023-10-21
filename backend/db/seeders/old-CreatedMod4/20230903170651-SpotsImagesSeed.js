"use strict";

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require("../../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const spotImageSeed = [
  {
    spotId: 1,
    url: "ImageUrl1",
    preview: true,
  },
  {
    spotId: 1,
    url: "ImageUrl1.5",
    preview: false,
  },
  {
    spotId: 1,
    url: "ImageUrl1.5",
    preview: false,
  },
  {
    spotId: 2,
    url: "ImageUrl1",
    preview: true,
  },
  {
    spotId: 2,
    url: "ImageUrl1.5",
    preview: false,
  },
  {
    spotId: 2,
    url: "ImageUrl1.5",
    preview: false,
  },
  {
    spotId: 3,
    url: "ImageUrl1",
    preview: true,
  },
  {
    spotId: 3,
    url: "ImageUrl1.5",
    preview: false,
  },
  {
    spotId: 3,
    url: "ImageUrl1.5",
    preview: false,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImageSeed, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: {
          [Op.between]: [0, 10],
        },
      },
      {}
    );
  },
};
