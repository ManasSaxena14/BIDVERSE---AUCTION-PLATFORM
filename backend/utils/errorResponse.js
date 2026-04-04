/**
 * Registry Exception Protocol (ErrorResponse)
 * Standardized interface for capturing and propagating institutional-grade exceptions 
 * with associated protocol status codes.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;

