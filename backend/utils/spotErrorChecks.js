const spotCreateErrorChecks = (req, _res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  let errTriggored = false;
  const err = new Error("Bad Request");
  err.status = 400;
  err.errors = {};

  if (!address) {
    err.errors.address = "Street address is required";
    errTriggored = true;
  }

  if (!city) {
    err.errors.city = "City is required";
    errTriggored = true;
  }

  if (!state) {
    err.errors.state = "State is required";
    errTriggored = true;
  }

  if (!country) {
    err.errors.country = "Country is required";
    errTriggored = true;
  }

  if (!lat || Number(lat) < -90 || Number(lat) > 90 || isNaN(lat)) {
    err.errors.lat = "Latitude is not valid";
    errTriggored = true;
  }

  if (!lng || Number(lng) < -180 || Number(lng) > 180 || isNaN(lng)) {
    err.errors.lng = "Longitude is not valid";
    errTriggored = true;
  }

  if (!description) {
    err.errors.description = "Description is required";
    errTriggored = true;
  }

  if (!price || price <= 0) {
    err.errors.price = "Price per day is required";
    errTriggored = true;
  }

  if (name != null && name != undefined && name.length > 50) {
    err.errors.name = "Name must be less than 50 characters";
    errTriggored = true;
  }

  if (errTriggored) next(err);
  next();
};

// ! for later to allow for editting and send edit info for only 1 or 2 attributes instead of having to send data for all of them every time --- Not Yet Implemented
const spotEditErrorChecks = async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  let errTriggored = false;
  const err = new Error("Bad Request");
  err.status = 400;
  err.errors = {};

  if (!lat || Number(lat) < -90 || Number(lat) > 90 || isNaN(lat)) {
    err.errors.lat = "Latitude is not valid";
    errTriggored = true;
  }

  if (!lng || Number(lng) < -180 || Number(lng) > 180 || isNaN(lng)) {
    err.errors.lng = "Longitude is not valid";
    errTriggored = true;
  }

  if (price <= 0) {
    err.errors.price = "Price per day is required";
    errTriggored = true;
  }

  if (name.length > 50) {
    err.errors.name = "Name must be less than 50 characters";
    errTriggored = true;
  }

  if (errTriggored) next(err);
  next();
};

module.exports = { spotCreateErrorChecks /* spotEditErrorChecks */ };
