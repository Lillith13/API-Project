"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    await queryInterface.createTable(
      "Reviews",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        spotId: {
          type: Sequelize.INTEGER,
          // references: {
          //   model: "Spots",
          // },
        },
        userId: {
          type: Sequelize.INTEGER,
          // references: {
          //   model: "Users",
          // },
        },
        review: {
          type: Sequelize.STRING,
        },
        stars: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      options
    );
=======
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spotId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "Spots",
        // },
      },
      userId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "Users",
        // },
      },
      review: {
        type: Sequelize.STRING,
      },
      stars: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
>>>>>>> dev
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.dropTable(options);
  },
};
