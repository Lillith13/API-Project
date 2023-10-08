"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const getRandNum = (max, min, precision) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return (
    Math.floor(
      Math.random() * (max * precision - min * precision) + precision
    ) / precision
  );
  // The maximum is inclusive and the minimum is inclusive - precision adjusts decimal, 100 = 2decimal
};

module.exports = {
  async up(queryInterface, Sequelize) {
    let creationCount;

    while (creationCount <= 120) {
      const ownerId = getRandNum(15, 1, 1); // random userId from users list
      const address = `${num} user${creationCount}'s Lane`;
      const city = `Seed${creationCount}`;
      const state = `Seedica${creationCount}`;
      const country = "United States of Seeds";
      const lat = getRandNum(90, -90, 100);
      const lng = getRandNum(180, -180, 100);
      const name = `demoSpot${creationCount}.${i}url`;
      const description = `Belongs to demoUser${creationCount}`;
      const price = getRandNum(5000, 1, 100);

      const demoSpotData = {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      };

      await Spot.create(demoSpotData);
      creationCount++;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: {
          [Op.between]: [0, 16],
        },
      },
      {}
    );
  },
};
