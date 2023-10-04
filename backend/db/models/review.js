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
      review: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 50],
        },
      },
      stars: {
        type: DataTypes.DECIMAL(1, 1),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      defaultScope: {
        exclude: ["createdAt", "updatedAt"],
      },
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
