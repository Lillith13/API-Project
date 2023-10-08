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

let seedUrlCreationCount = 0;
async function createSpotImages() {
  let demoSpot;
  const allSpotIds = await Spot.findAll({
    attributes: ["id"],
  });
  const allSpotIdsSet = new Set();
  allSpotIds.forEach((spot) => {
    allSpotIdsSet.add(spot.id);
  });
  while (seedUrlCreationCount <= 30) {
    demoSpot = {
      spotId: getRandNum(allSpotIds.length + 1, 1),
      url: `moreDemoSeedUrl${seedUrlCreationCount}`,
      preview: false, // by default
    };
    seedUrlCreationCount++;
    seedUrlCreationCount % 3 === 0
      ? (demoSpot.preview = true)
      : (demoSpot.preview = false);
  }
  await SpotImage.create(demoSpot);
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
