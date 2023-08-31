"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demoUsers = [
  {
    email: "demoUser1@user.io",
    username: "demoUser1",
    hashedPassword: bcrypt.hashSync("passDemo1"),
  },
  {
    email: "demoUser2@user.io",
    username: "demoUser2",
    hashedPassword: bcrypt.hashSync("passDemo2"),
  },
  {
    email: "demoUser3@user.io",
    username: "demoUser3",
    hashedPassword: bcrypt.hashSync("passDemo3"),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(demoUsers, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["demoUser1", "demoUser2", "demoUser3"],
        },
      },
      {}
    );
  },
};
