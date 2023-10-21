"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demoUsers = [];
const buildDemoUser = () => {
  let count = 0;
  while (count < 5) {
    demoUsers.push({
      firstName: "demo",
      lastName: "user",
      email: `demoUser${count}@demo.io`,
      username: `demoUser${count}`,
      hashedPassword: bcrypt.hashSync(`password${count}`),
    });
    count++;
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    buildDemoUser();
    await User.bulkCreate(demoUsers, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.startsWith]: "demoUser",
        },
      },
      {}
    );
  },
};
