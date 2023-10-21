"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Spot, Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const randomNum = (min, max) => {
  const randNum = Math.floor(Math.random() * (max - min + 1) + min);
  return randNum;
};

const buildDemoReviews = async () => {
  const spotsIdsArr = await Spot.findAll({
    attributes: ["id", "ownerId"],
  });
  const usersIdsArr = await User.findAll({
    attributes: ["id"],
  });
  const demoRevs = [];
  let count = 1;
  spotsIdsArr.forEach((spot) => {
    usersIdsArr.forEach((user) => {
      if (Number(user.id) !== Number(spot.ownerId)) {
        demoRevs.push({
          spotId: spot.id,
          userId: user.id,
          review: `demoReview${count}`,
          stars: `${randomNum(1, 5)}`,
        });
        count++;
      }
    });
  });
  return demoRevs;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoReviews = await buildDemoReviews();
    await Review.bulkCreate(demoReviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        review: {
          [Op.startsWith]: "demoReview",
        },
      },
      {}
    );
  },
};
