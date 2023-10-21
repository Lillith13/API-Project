"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User, Review, ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const buildDemoRevImgs = async () => {
  const demoRevImgs = [];
  const users = await User.findAll({
    attributes: ["id"],
  });
  const reviews = await Review.findAll({
    attributes: ["id", "userId"],
  });
  let count = 0;
  reviews.forEach((review) => {
    users.forEach((user) => {
      if (review.userId === user.id) {
        demoRevImgs.push(
          ...[
            {
              reviewId: review.id,
              url: `demoRevImg${count + 1}`,
            },
            {
              reviewId: review.id,
              url: `demoRevImg${count + 2}`,
            },
            {
              reviewId: review.id,
              url: `demoRevImg${count + 3}`,
            },
          ]
        );
      }
    });
    count += 3;
  });
  return demoRevImgs;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoRevImgs = await buildDemoRevImgs();
    await ReviewImage.bulkCreate(demoRevImgs, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.startsWith]: "demoRevImg",
      },
    });
  },
};
