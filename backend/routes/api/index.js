const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");

// checks if user signed in or guest
router.use(restoreUser);

module.exports = router;
