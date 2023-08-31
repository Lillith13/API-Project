const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");

// checks if user signed in or guest
router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);

router.post("/test", function (req, res) {
  res.json({
    requestBody: req.body,
  });
});

module.exports = router;
