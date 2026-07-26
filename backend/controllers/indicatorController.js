const Indicator = require('../models/Indicator');
const Ranking = require('../models/Ranking');
const HistoricalData = require('../models/HistoricalData');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const { category, source, q } = req.query;
    let query = {};

    if (category) query.category = category;
    if (q) {
      // Text search with fallback regex
      const textResults = await Indicator.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).populate('category');

      if (textResults.length > 0) return successResponse(res, textResults);
      query.name = { $regex: q, $options: 'i' };
    }

    const indicators = await Indicator.find(query).populate('category').sort({ name: 1 });
    return successResponse(res, indicators);
  } catch (err) { next(err); }
};

const getBySlug = async (req, res, next) => {
  try {
    const indicator = await Indicator.findOne({ slug: req.params.slug }).populate('category');
    if (!indicator) return errorResponse(res, 'Indicator not found', 404);
    return successResponse(res, indicator);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const indicator = new Indicator(req.body);
    await indicator.save();
    return successResponse(res, indicator, 201);
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 'Indicator with this name or slug already exists', 409);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const indicator = await Indicator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!indicator) return errorResponse(res, 'Indicator not found', 404);
    return successResponse(res, indicator);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const indicator = await Indicator.findByIdAndDelete(req.params.id);
    if (!indicator) return errorResponse(res, 'Indicator not found', 404);
    // Cascade delete
    await Promise.all([
      Ranking.deleteMany({ indicator: req.params.id }),
      HistoricalData.deleteMany({ indicator: req.params.id })
    ]);
    return successResponse(res, { message: 'Indicator and associated data deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getBySlug, create, update, remove };
