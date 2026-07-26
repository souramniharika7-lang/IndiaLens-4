const News = require('../models/News');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const { category, limit } = req.query;
    const query = {};
    if (category) query.category = category;

    let newsQuery = News.find(query)
      .populate('category')
      .sort({ publishedAt: -1 });

    if (limit) newsQuery = newsQuery.limit(parseInt(limit));

    const news = await newsQuery;
    return successResponse(res, news);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const article = await News.findById(req.params.id).populate('category');
    if (!article) return errorResponse(res, 'News article not found', 404);
    return successResponse(res, article);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    if (!req.body.headline) return errorResponse(res, 'Headline is required', 400);
    const article = new News({ ...req.body, createdBy: req.user.id });
    await article.save();
    return successResponse(res, article, 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return errorResponse(res, 'News article not found', 404);
    return successResponse(res, article);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return errorResponse(res, 'News article not found', 404);
    return successResponse(res, { message: 'Article deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
