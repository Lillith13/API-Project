const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");

const { restoreUser } = require("../../utils/auth.js");
// checks if user signed in or guest
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);

const { SpotImage, ReviewImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const {
  spotBelongsToUser,
  reviewBelongsToUser,
} = require("../../utils/belongsToUser");
const {
  spotImageExists,
  revImageExists,
} = require("../../utils/recordExists.js");

// DELETE spot image
router.delete(
  "/spot-images/:imageId",
  [requireAuth, spotImageExists, spotBelongsToUser],
  async (req, res) => {
    const spotImg = await SpotImage.findByPk(req.params.imageId);

    await spotImg.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
);

// DELETE review image
router.delete(
  "/review-images/:imageId",
  [requireAuth, revImageExists, reviewBelongsToUser],
  async (req, res) => {
    const revImg = await ReviewImage.findByPk(req.params.imageId);

    await revImg.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
);

router.post("/test", function (req, res) {
  res.json({
    requestBody: req.body,
  });
});

module.exports = router;
