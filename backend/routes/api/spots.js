const express = require("express");
const router = express.Router();

const { Spot } = require("../../db/models");
const spotCreateErrorChecks = require("../../utils/spotErrorChecks");

// get all spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();
  return res.json(spots);
});

// get spots owned by logged in user
//  --> Add authentication
router.get("/mySpots", async (req, res) => {
  const userSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.json(userSpots);
});

// get spot by it's id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.json({ message: "Spot couldn't be found" });
  return res.json(spot);
});

// create new spot
router.post("/mySpots", spotCreateErrorChecks, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  return res.json(newSpot);
});

module.exports = router;
