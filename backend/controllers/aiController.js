const AIInsightsCache = require('../models/AIInsightsCache');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get or serve cached AI insights for a given scope
 * @param {string} scope - 'global', category slug, or indicator slug
 */
const getInsights = async (scope) => {
  const cached = await AIInsightsCache.findOne({
    scope,
    expiresAt: { $gt: new Date() }
  });
  return cached;
};

const getGlobalInsights = async (req, res, next) => {
  try {
    const cached = await getInsights('global');
    if (cached) return successResponse(res, { ...cached.toObject(), cached: true });

    // Fallback: get expired cache
    const expired = await AIInsightsCache.findOne({ scope: 'global' }).sort({ generatedAt: -1 });
    if (expired) return successResponse(res, { ...expired.toObject(), cached: true });

    return errorResponse(res, 'AI insights not available', 503);
  } catch (err) { next(err); }
};

const getCategoryInsights = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cached = await getInsights(slug);
    if (cached) return successResponse(res, { ...cached.toObject(), cached: true });

    const expired = await AIInsightsCache.findOne({ scope: slug }).sort({ generatedAt: -1 });
    if (expired) return successResponse(res, { ...expired.toObject(), cached: true });

    return errorResponse(res, 'AI insights not available for this category', 503);
  } catch (err) { next(err); }
};

const getIndicatorInsights = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cached = await getInsights(slug);
    if (cached) return successResponse(res, { ...cached.toObject(), cached: true });

    const expired = await AIInsightsCache.findOne({ scope: slug }).sort({ generatedAt: -1 });
    if (expired) return successResponse(res, { ...expired.toObject(), cached: true });

    return errorResponse(res, 'AI insights not available for this indicator', 503);
  } catch (err) { next(err); }
};

const refreshAll = async (req, res, next) => {
  try {
    const count = await AIInsightsCache.countDocuments();
    return successResponse(res, { message: `${count} cached insights available. Refresh from external AI API not configured.` });
  } catch (err) { next(err); }
};

module.exports = { getGlobalInsights, getCategoryInsights, getIndicatorInsights, refreshAll };
