const Ranking = require('../models/Ranking');
const HistoricalData = require('../models/HistoricalData');
const Country = require('../models/Country');
const Indicator = require('../models/Indicator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const { indicator, country, year } = req.query;
    const query = {};
    if (indicator) query.indicator = indicator;
    if (country) query.country = country;
    if (year) query.year = parseInt(year);

    const rankings = await Ranking.find(query)
      .populate('indicator')
      .populate('country')
      .sort({ rank: 1 });

    return successResponse(res, rankings);
  } catch (err) { next(err); }
};

const getHistorical = async (req, res, next) => {
  try {
    const { indicatorId, countryId } = req.params;
    const historical = await HistoricalData.findOne({ indicator: indicatorId, country: countryId })
      .populate('indicator')
      .populate('country');
    if (!historical) return errorResponse(res, 'Historical data not found', 404);
    return successResponse(res, historical);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { indicator, country, year, rank, score } = req.body;
    if (!indicator || !country || !year) {
      return errorResponse(res, 'Validation failed', 400, { fields: 'indicator, country, and year are required' });
    }

    const [indExists, countryExists] = await Promise.all([
      Indicator.findById(indicator),
      Country.findById(country)
    ]);
    if (!indExists) return errorResponse(res, 'Indicator not found', 404);
    if (!countryExists) return errorResponse(res, 'Country not found', 404);

    const ranking = new Ranking({ indicator, country, year: parseInt(year), rank, score, totalCountries: 195 });
    await ranking.save();
    return successResponse(res, ranking, 201);
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 'Ranking entry already exists for this indicator/country/year', 409);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const ranking = await Ranking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ranking) return errorResponse(res, 'Ranking not found', 404);
    return successResponse(res, ranking);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const ranking = await Ranking.findByIdAndDelete(req.params.id);
    if (!ranking) return errorResponse(res, 'Ranking not found', 404);
    return successResponse(res, { message: 'Ranking deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getHistorical, create, update, remove };
