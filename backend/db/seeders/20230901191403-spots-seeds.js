"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const spotSeed = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -117.37646,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(spotSeed, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options);
  },
};
