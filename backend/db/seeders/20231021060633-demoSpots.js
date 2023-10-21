"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const randomNum = (min, max) => {
  const randNum = Math.floor(Math.random() * (max - min + 1) + min);
  return randNum;
};

const buildDemoSpot = async () => {
  const demoSpots = [];
  const userIdsArr = await User.findAll({
    attributes: ["id"],
  });
  let count = 1;
  userIdsArr.forEach((user) => {
    const tempArr = [
      {
        ownerId: user.id,
        address: `${randomNum(1, 500)} ${count} Lane`,
        city: `TestSpot${count}`,
        state: `Test${count}`,
        country: `Country of ${user.id} Land`,
        lat: `${randomNum(-90, 90)}`,
        lng: `${randomNum(-180, 180)}`,
        name: `DemoSpot${count}`,
        description: `DemoSpot${count}`,
        price: `${randomNum(0.99, 9999.99)}`,
      },
      {
        ownerId: user.id,
        address: `${randomNum(1, 500)} ${count + 1} Lane`,
        city: `TestSpot${count + 1}`,
        state: `Test${count + 1}`,
        country: `Country of ${user.id} Land`,
        lat: `${randomNum(-90, 90)}`,
        lng: `${randomNum(-180, 180)}`,
        name: `DemoSpot${count + 1}`,
        description: `DemoSpot${count + 1}`,
        price: `${randomNum(0.99, 9999.99)}`,
      },
      {
        ownerId: user.id,
        address: `${randomNum(1, 500)} ${count + 2} Lane`,
        city: `TestSpot${count + 2}`,
        state: `Test${count + 2}`,
        country: `Country of ${user.id} Land`,
        lat: `${randomNum(-90, 90)}`,
        lng: `${randomNum(-180, 180)}`,
        name: `DemoSpot${count + 2}`,
        description: `DemoSpot${count + 2}`,
        price: `${randomNum(0.99, 9999.99)}`,
      },
    ];
    demoSpots.push(...tempArr);
    count += 3;
  });
  return demoSpots;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoSpotSeeds = await buildDemoSpot();
    await Spot.bulkCreate(demoSpotSeeds, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.startsWith]: "DemoSpot",
        },
      },
      {}
    );
  },
};
