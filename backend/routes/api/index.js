const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");

const { restoreUser } = require("../../utils/auth.js");
// checks if user signed in or guest
router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);

// display available tables and endpoints on start-up
router.get("/test", async (req, res) => {
  const availableEndPointsList = {
    GET: {
      "/": "displays home-page -> all available endpoints and database tables (tables currently unavailable to display)",
      "/api/csrf/restore": "restores csrf token",
      "/api/session":
        "get currently signed in user -> displays null if no user signed in",
      "/api/spots": "get all spots",
      "/api/spots/:spotId": "get specific spot by it's ID",
      "/api/spots/mySpots":
        "returns all spots owned by the currently logged in user",
    },
    POST: {
      "/session": "user log-in route",
      "/users": "user sign-up route",
      "/spots/mySpots":
        "creates new spot owned by the currently signed in user",
    },
  };
  // const availableTables = await fetch()
  res.json(availableEndPointsList);
});

router.post("/test", function (req, res) {
  res.json({
    requestBody: req.body,
  });
});

module.exports = router;
