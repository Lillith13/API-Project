const { User } = require("../db/models");

// checks against saved user information to prevent duplicate usernames/emails
const checkIfUserExists = async (req, res, next) => {
  const { username, email } = req.body;
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
  if (usersWusername || usersWemail) {
    const err = new Error("User already exists.");
    err.status = 500;
    err.title = "User already exists";
    err.errors = {};
    if (usersWusername) {
      err.errors.username = "User with that username already exists.";
    }
    if (usersWemail) {
      err.errors.email = "User with that email already exists.";
    }
    next(err);
  }
  next();
};

// double check if inputs === valid
const doubleCheckInputs = (req, res, next) => {
  const { firstName, lastName, email, username } = req.body;
  if (!email || !username || !firstName || !lastName) {
    const err = new Error("Bad Request");
    err.title = "Bad Request";
    err.errors = {};
    err.status = 400;
    if (!email) err.errors.email = "Invalid email";
    if (!username) err.errors.username = "Username is required";
    if (!firstName) err.errors.firstName = "First Name is required.";
    if (!lastName) err.errors.lastName = "Last Name is required";
    next(err);
  }
  next();
};

module.exports = {
  checkIfUserExists,
  doubleCheckInputs,
};
