"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // Spot.hasMany(models.SpotImage, {
      //   foreignKey: "spotId",
      // });
      // Spot.hasMany(models.Review, {
      //   foreignKey: "spotId",
      // });
      // Spot.hasMany(models.Booking, {
      //   foreignKey: "spotId",
      // });
      // Spot.belongsTo(models.User, {
      //   foreignKey: "ownerId",
      // });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: "Users",
        // },
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
