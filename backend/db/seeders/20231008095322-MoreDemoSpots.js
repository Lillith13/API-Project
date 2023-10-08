"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const getRandNum = (max, min, precision) => {
  const posOneg = Math.floor(Math.random() * (1 - 0) + 1);
  if (posOneg) {
    min = min * -1;
    return (
      (Math.floor(
        Math.random() * (max * precision - min * precision) + precision
      ) /
        precision) *
      -1
    );
  }
  return (
    Math.floor(
      Math.random() * (max * precision - min * precision) + precision
    ) / precision
  );
  // The maximum is inclusive and the minimum is inclusive - precision adjusts decimal, 100 = 2decimal
};

async function buildSpots() {
  let demoSpotDataArray = [];
  let creationCount;

  const allUsers = await User.findAll({
    attibutes: ["id"],
  });
  while (allUsers.length > 0) {
    const userId = allUsers[0].id;
    for (let i = 0; i < 5; i++) {
      const address = `${userId} user${creationCount}'s Lane`;
      const city = `Seed${creationCount}`;
      const state = `Seedica${creationCount}`;
      const country = "United States of Seeds";
      const lat = getRandNum(90, 0, 100);
      const lng = getRandNum(180, 0, 100);
      const name = `demoSpot${creationCount}.${userId}url`;
      const description = `Belongs to demoUser${creationCount}`;
      const price = getRandNum(5000, 1, 100);

      demoSpotDataArray.push({
        ownerId: userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });
      creationCount++;
    }
    allUsers.splice(0, 1); //remove first array item
  }
  await Spot.bulkCreate(demoSpotDataArray);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    buildSpots();
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
