const { Op } = require("sequelize");

async function filterNpagi(req, _res, next) {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  req.where = {};

  if (!page || isNaN(page) || page >= 11) page = 1;
  if (!size || isNaN(size) || size >= 21) size = 20;

  if (minLat && maxLat) req.where.lat = { [Op.between]: [minLat, maxLat] };
  else if (minLat && !maxLat) req.where.lat = { [Op.gte]: minLat };
  else if (maxLat && !minLat) req.where.lat = { [Op.lte]: maxLat };

  if (minLng && maxLng) req.where.lng = { [Op.between]: [minLng, maxLng] };
  else if (minLng && !maxLng) req.where.lng = { [Op.gte]: minLng };
  else if (maxLng && !minLng) req.where.lng = { [Op.lte]: maxLng };

  if (minPrice && maxPrice)
    req.where.price = { [Op.between]: [minPrice, maxPrice] };
  else if (minPrice && !maxPrice) req.where.price = { [Op.gte]: minPrice };
  else if (maxPrice && !minPrice) req.where.price = { [Op.lte]: maxPrice };

  req.pagination = {
    limit: size,
    offset: (page - 1) * size,
  };

  next();
}

module.exports = { filterNpagi };
