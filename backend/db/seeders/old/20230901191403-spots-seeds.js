"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require("../../models");

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
    price: 50,
  },
  {
    ownerId: 2,
    address: "903 Warren Ave",
    city: "Front Royal",
    state: "Virginia",
    country: "United States of America",
    lat: 38.93043,
    lng: -78.19507,
    name: "Fantasy Land Park",
    description:
      "An old ass park...beware of the volleyball court, its filled with needles",
    price: 25,
  },
  {
    ownerId: 3,
    address: "3330 Chuckwagon Rd",
    city: "Colorado Springs",
    state: "Colorado",
    country: "United States of America",
    lat: 38.91696,
    lng: -104.88446,
    name: "Flying W Ranch & Chuckwagon Supper",
    description: "CO tourist trap",
    price: 89,
  },
  {
    ownerId: 3,
    address: "4 demo spot",
    city: "DemoSpotia",
    state: "Spotia",
    country: "Spotsilvania",
    lat: 50.916,
    lng: -12.88,
    name: "Demo Spot",
    description: "demo spot",
    price: 150.0,
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
