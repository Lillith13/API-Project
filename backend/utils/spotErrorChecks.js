const spotCreateErrorChecks = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const err = new Error("Bad Request");
  err.status = 400;
  err.errors = {};
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
    if (!address) err.errors.address = "Street address is required";
    if (!city) err.errors.city = "City is required";
    if (!state) err.errors.state = "State is required";
    if (!country) err.errors.country = "Country is required";
    if (!lat) err.errors.lat = "Latitude is not valid";
    if (!lng) err.errors.lng = "Longitude is not valid";
    // if (!name)
    //   err.errors.name = "Name must be less than 50 characters";
    if (!description) err.errors.description = "Description is required";
    if (!price || price <= 0) err.errors.price = "Price per day is required";
    next(err);
  }
  if (Number(lat) <= -90 || Number(lat) >= 90 || isNaN(lat))
    err.errors.lat = "Latitude is not valid";
  if (Number(lng) <= -180 || Number(lat) >= 180 || isNaN(lng))
    err.errors.lng = "Longitude is not valid";
  if (name.length > 50)
    err.errors.name = "Name must be less than 50 characters";
  next();
};

module.exports = spotCreateErrorChecks;
