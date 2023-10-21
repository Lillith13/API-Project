"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demoUsers = [
  {
    firstName: "Bob",
    lastName: "Builder",
    email: "demoUser1@user.io",
    username: "demoUser1",
    hashedPassword: bcrypt.hashSync("passDemo1"),
  },
  {
    firstName: "Baul",
    lastName: "Plart",
    email: "theycallme_Sheriff@user.io",
    username: "TheMallSheriff",
    hashedPassword: bcrypt.hashSync("passDemo2"),
  },
  {
    firstName: "Mr",
    lastName: "Pickles",
    email: "tripleSixFix@hellspawn.io",
    username: "theTripleSixer",
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
          [Op.in]: ["demoUser1", "TheMallSheriff", "theTripleSixer"],
        },
      },
      {}
    );
  },
};
