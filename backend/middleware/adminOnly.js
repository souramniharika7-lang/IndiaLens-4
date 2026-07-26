const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to restrict access to admin-role users only.
 * Must be used after verifyJWT middleware.
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 'Insufficient permissions', 403);
  }
  next();
};

module.exports = adminOnly;
