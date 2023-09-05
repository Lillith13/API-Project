const spotCreateErrorChecks = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (
    !address ||
    !city ||
    !state ||
    !country ||
    !lat ||
    !lng ||
    !name ||
    !description ||
    !price
  ) {
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {};
    if (!address) err.errors.address = "Street address is required";
    if (!city) err.errors.city = "City is required";
    if (!state) err.errors.state = "State is required";
    if (!country) err.errors.country = "Country is required";
    if (lat >= -90 && lat <= 90) err.errors.lat = "Latitude is not valid";
    if (lng >= -180 && lng <= 180) err.errors.lng = "Longitude is not valid";
    if (name.length > 50)
      err.errors.name = "Name must be less than 50 characters";
    if (!description) err.errors.description = "Description is required";
    if (!price) err.errors.price = "Price per day is required";
    next(err);
  }
  next();
};

module.exports = spotCreateErrorChecks;
