async function queryValidation(req, _res, next) {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const err = new Error("Query parameter validation errors");
  err.errors = {};
  let errTriggered = false;

  if (page < 1) {
    err.errors.page = "Page must be greater than or equal to 1";
    errTriggered = true;
  }
  if (size < 1) {
    err.errors.size = "Size must be greater than or equal to 1";
    errTriggered = true;
  }
  if (minLat > 90 || minLat < -90) {
    err.errors.minLat = "Minimum latitude is invalid";
    errTriggered = true;
  }
  if (maxLat > 90 || maxLat < -90) {
    err.errors.maxLat = "Maximum latitude is invalid";
    errTriggered = true;
  }
  if (minLat > maxLat) {
    err.errors.lat =
      "Minimum latitude cannot be greater than the Maximum latitude";
    errTriggered = true;
  }
  if (minLng > 180 || minLng < -180) {
    err.errors.minLng = "Minimum longitude is invalid";
    errTriggered = true;
  }
  if (maxLng > 180 || maxLng < -180) {
    err.errors.maxLng = "Maximum longitude is invalid";
    errTriggered = true;
  }
  if (minLng > maxLng) {
    err.errors.lng =
      "Minimum longitude cannot be greater than the Maximum longitude";
    errTriggered = true;
  }
  if (minPrice < 0) {
    err.errors.minPrice = "Minimum price must be greater than or equal to 0";
    errTriggered = true;
  }
  if (maxPrice < 0) {
    err.errors.maxPrice = "Maximum price must be greater than or equal to 0";
    errTriggered = true;
  }

  if (errTriggered) {
    err.status = 400;
    err.message = "Bad Request";
    next(err);
  }
  next();
}

module.exports = queryValidation;
