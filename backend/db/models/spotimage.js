"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      // * non-aliased relationship
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      // * aliased relationship
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        as: "previewImage",
        onDelete: "CASCADE",
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Spots",
        },
      },
      url: DataTypes.STRING,
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "SpotImage",
    }
  );
  return SpotImage;
};
