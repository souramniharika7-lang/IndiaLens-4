/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns structured JSON 500 response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
