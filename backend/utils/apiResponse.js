/**
 * Send a successful API response
 * @param {object} res - Express response object
 * @param {any} data - Response payload
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

/**
 * Send an error API response
 * @param {object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {object} details - Optional field-level error details
 */
const errorResponse = (res, error, statusCode = 500, details = null) => {
  const body = { success: false, error };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
};

module.exports = { successResponse, errorResponse };
