const Country = require('../models/Country');
const Ranking = require('../models/Ranking');
const HistoricalData = require('../models/HistoricalData');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    return successResponse(res, countries);
  } catch (err) { next(err); }
};

const getByCode = async (req, res, next) => {
  try {
    const country = await Country.findOne({ code: req.params.code.toUpperCase() });
    if (!country) return errorResponse(res, 'Country not found', 404);
    return successResponse(res, country);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const country = new Country(req.body);
    await country.save();
    return successResponse(res, country, 201);
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 'Country already exists', 409);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) return errorResponse(res, 'Country not found', 404);
    return successResponse(res, country);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return errorResponse(res, 'Country not found', 404);
    // Cascade delete
    await Promise.all([
      Ranking.deleteMany({ country: req.params.id }),
      HistoricalData.deleteMany({ country: req.params.id })
    ]);
    return successResponse(res, { message: 'Country and associated data deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getByCode, create, update, remove };
