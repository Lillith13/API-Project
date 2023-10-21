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
  let count = 0;
  spotsIdsArr.forEach((spot) => {
    const tempArr = [];
    for (let i = 1; i <= 10; i++) {
      let preview = i === 1;
      tempArr.push({
        spotId: `${spot.id}`,
        url: `demoImage${count + i}.url`,
        preview,
      });
    }
    count++;
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
