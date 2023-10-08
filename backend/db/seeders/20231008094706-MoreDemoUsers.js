"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const moreDemoUsers = [
  {
    firstName: "fourth",
    lastName: "DemoUser",
    email: "fourthDemo@email.io",
    username: "fourthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo4"),
  },
  {
    firstName: "fifth",
    lastName: "DemoUser",
    email: "fifthDemo@email.io",
    username: "fifthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo5"),
  },
  {
    firstName: "sixth",
    lastName: "DemoUser",
    email: "sixthDemo@email.io",
    username: "sixthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo6"),
  },
  {
    firstName: "seventh",
    lastName: "DemoUser",
    email: "seventhDemo@email.io",
    username: "seventhDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo7"),
  },
  {
    firstName: "eighth",
    lastName: "DemoUser",
    email: "eighthDemo@email.io",
    username: "eighthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo8"),
  },
  {
    firstName: "ninth",
    lastName: "DemoUser",
    email: "ninthDemo@email.io",
    username: "ninthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo9"),
  },
  {
    firstName: "tenth",
    lastName: "DemoUser",
    email: "tenthDemo@email.io",
    username: "tenthDemoUser",
    hashedPassword: bcrypt.hashSync("passDemo10"),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(moreDemoUsers, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: [
          "fourthDemoUser",
          "fifthDemoUser",
          "sixthDemoUser",
          "seventhDemoUser",
          "eighthDemoUser",
          "ninthDemoUser",
          "tenthDemoUser",
        ],
      },
    });
  },
};
