"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot, SpotImage } = require("../../models");

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

async function createSpotImages() {
  const spotCount = await Spot.count();
  const demoSpotsArr = [];
  let seedsUrlCreationCount = 0;

  while (seedsUrlCreationCount <= spotCount * 5) {
    const spotId = getRandNum(spotCount, 1);
    const url = `moreDemoSeedUrl${seedsUrlCreationCount}`;
    // by default

    let preview = false;
    if (seedsUrlCreationCount % 3 === 0) {
      preview = true;
    } else {
      preview = false;
    }

    demoSpotsArr.push({
      spotId,
      url,
      preview,
    });

    seedsUrlCreationCount++;
  }
  await SpotImage.bulkCreate(demoSpotsArr);
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
