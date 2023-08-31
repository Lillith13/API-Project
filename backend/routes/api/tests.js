// to use - move to index.js or activate this file as a router file

router.post("/test", function (req, res) {
  res.json({
    requestBody: req.body,
  });
});

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");

// test setTokenCookie
const { User } = require("../../db/models");
router.get("/set-token-cookie", async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: "demoUser1",
    },
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

// test restoreUser
router.use(restoreUser);
router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

// check/require auth
router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});
