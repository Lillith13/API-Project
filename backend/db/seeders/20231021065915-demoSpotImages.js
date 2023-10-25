"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot, SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const buildSpotImageSeeds = async () => {
  const demoSpotImgs = [];
  const spotsIdsArr = await Spot.findAll({
    attributes: ["id"],
  });
  let count = 1;
  spotsIdsArr.forEach((spot) => {
    const tempArr = [];
    for (let i = 1; i <= 5; i++) {
      let preview =
        count === 1 ||
        count === 6 ||
        count === 11 ||
        count === 16 ||
        count === 21 ||
        count === 26 ||
        count === 31 ||
        count === 36 ||
        count === 41 ||
        count === 46 ||
        count === 51 ||
        count === 56 ||
        count === 61 ||
        count === 66 ||
        count === 71 ||
        count === 76 ||
        count === 81 ||
        count === 86 ||
        count === 91 ||
        count === 96;
      tempArr.push({
        spotId: `${spot.id}`,
        url: `/images/BirdHouse${count}.jpg`,
        preview,
      });
      count++;
    }
    demoSpotImgs.push(...tempArr);
  });
  return demoSpotImgs;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const spotImgSeeds = await buildSpotImageSeeds();
    await SpotImage.bulkCreate(spotImgSeeds, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.startsWith]: "demoImage",
        },
      },
      {}
    );
  },
};
