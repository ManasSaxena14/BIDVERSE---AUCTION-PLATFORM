const ErrorResponse = require('../utils/errorResponse');

/**
 * Global Error Handling Middleware
 * Maps specialized database and operational errors to institutional responses
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  /**
   * System Logs
   */
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  /**
   * Resource Identification Failures (Mongoose CastError)
   */
  if (err.name === 'CastError') {
    const message = `Resource identification failure: Invalid ID [${err.value}]`;
    error = new ErrorResponse(message, 404);
  }

  /**
   * Entity Redundancy Failures (Mongoose Duplicate Key)
   */
  if (err.code === 11000) {
    const message = 'Entity redundancy detected: Duplicate unique attribute provided.';
    error = new ErrorResponse(message, 400);
  }

  /**
   * Schema Constrainment Failures (Mongoose ValidationError)
   */
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Protocol Error'
  });
};

module.exports = errorHandler;


