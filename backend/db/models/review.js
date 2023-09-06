"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // * non-aliased relationships
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      // * aliased relationship
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        as: "avgRating",
        onDelete: "CASCADE",
      });
    }
  }
  Review.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Spots",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
        },
      },
      review: DataTypes.STRING,
      stars: DataTypes.INTEGER,
    },
    {
      defaultScope: {
        exclude: ["createdAt", "updatedAt"]
      },
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
