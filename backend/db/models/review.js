"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review.hasMany(models.ReviewImage, {
      //   foreignKey: "reviewId",
      // });
      // Review.belongsTo(models.Spot, {
      //   foreignKey: "spotId",
      // });
      // Review.belongsTo(models.User, {
      //   foreignKey: "userId",
      // });
    }
  }
  Review.init(
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
      review: DataTypes.STRING,
      stars: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
