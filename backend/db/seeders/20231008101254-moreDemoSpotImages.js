"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot, SpotImage } = require("../models");

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

let seedsUrlCreationCount = 0;
async function createSpotImages() {
  const spotId = getRandNum(120, 1);
  const url = `moreDemoSeedUrl${seedsUrlCreationCount}`; // by default
  let preview = false;
  seedsUrlCreationCount % 3 === 0 ? (preview = true) : (preview = false);

  while (seedsUrlCreationCount <= 480) {
    const demoSpot = {
      spotId,
      url,
      preview,
    };

    await SpotImage.create(demoSpot);
    seedsUrlCreationCount++;
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    createSpotImages();
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.startsWith]: "moreDemoSeedUrl",
        },
      },
      {}
    );
  },
};
