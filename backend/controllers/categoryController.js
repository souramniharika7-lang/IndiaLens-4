const Category = require('../models/Category');
const Indicator = require('../models/Indicator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return successResponse(res, categories);
  } catch (err) { next(err); }
};

const getBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return errorResponse(res, 'Category not found', 404);
    const indicators = await Indicator.find({ category: category._id });
    return successResponse(res, { category, indicators });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    return successResponse(res, category, 201);
  } catch (err) {
    if (err.code === 11000) return errorResponse(res, 'Category already exists', 409);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return errorResponse(res, 'Category not found', 404);
    return successResponse(res, category);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);
    return successResponse(res, { message: 'Category deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getBySlug, create, update, remove };
