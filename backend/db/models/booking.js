"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Booking.belongsTo(models.Spot, {
      //   foreignKey: "spotId",
      // });
      // Booking.belongsTo(models.User, {
      //   foreignKey: "userId",
      // });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: "Spots",
        // },
      },
      userId: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: "Users",
        // },
      },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
