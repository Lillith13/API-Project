"use strict";

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

async function buildUsers() {
  let userCount = 4;
  let demoUsers = [];
  while (userCount <= 50) {
    demoUsers.push({
      firstName: `UserF${userCount}`,
      lastName: `UserL${userCount}`,
      email: `demoUser${userCount}@user${userCount}.io`,
      username: `demoUser${userCount}`,
      hashedPassword: bcrypt.hashSync(`passDemo${userCount}`),
    });
    userCount++;
  }
  await User.bulkCreate(demoUsers);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    buildUsers();
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: {
          [Op.between]: [1, 51],
        },
      },
      {}
    );
  },
};
