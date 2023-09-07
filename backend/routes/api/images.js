const express = require("express");
const router = express.Router();

const { SpotImage, ReviewImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const { spotExists, reviewExists } = require("../../utils/recordExists");
const {
  spotBelongsToUser,
  reviewBelongsToUser,
} = require("../../utils/belongsToUser");

// DELETE spot image
router.delete(
  "/spot/:spotId/:imgId",
  [requireAuth, spotExists, spotBelongsToUser],
  async (req, res) => {
    const spotImg = await SpotImage.findByPk(req.params.imgId);
    try {
      await spotImg.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

// DELETE review image
router.delete(
  "/review/:reviewId/:imgId",
  [requireAuth, reviewExists, reviewBelongsToUser],
  async (req, res) => {
    const revImg = await ReviewImage.findByPk(req.params.imgId);
    try {
      await revImg.destroy();
      return res.json({
        message: "Successfully deleted",
      });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
