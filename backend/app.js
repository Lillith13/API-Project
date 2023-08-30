/* --- BoilerPlate --- */
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

app.use(cookieParser());
app.use(express.json());

// security middleware
if (!isProduction) {
  app.use(cors());
}

// enable helmet middleware to set a variety of headers for better security
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// create csurf middleware to set _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "lax",
      httpOnly: true,
    },
  })
);

const routes = require("./routes");
app.use(routes); //collect all routes

module.exports = app;
