const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");

const router = express.Router();

// validate signup inputs
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// checks against saved user information to prevent duplicate usernames/emails
const checkIfUserExists = async (username, email) => {
  const usersWusername = await User.findOne({
    where: {
      username,
    },
  });
  const usersWemail = await User.findOne({
    where: {
      email,
    },
  });
  if (usersWusername) {
    const err = new Error("The requested resource couldn't be found.");
    err.status(500);
    err.title = "User already exists";
    err.errors = { username: "User with that username already exists." };
    next(err);
  }
  if (usersWemail) {
    const err = new Error("The requested resource couldn't be found.");
    err.status(500);
    err.title = "User already exists";
    err.errors = { email: "User with that email already exists." };
    next(err);
  }
};

// user sign-up endpoint
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  checkIfUserExists(username, email);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };
  await setTokenCookie(res, safeUser);
  return res.json({ user: safeUser });
});

module.exports = router;
