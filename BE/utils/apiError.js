class ApiError extends Error {
  constructor(message,  data = null, statusCode = 500, errors = [], stack = null ) {
    super(message);

    // Custom properties
    this.data = data;              // Extra context (e.g., request payload)
    this.statusCode = statusCode;  // HTTP status code
    this.errors = errors;          // Array of validation or sub-errors

    // Preserve stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Name the error class for clarity
    this.name = this.constructor.name;
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      error: {
        code: this.name,
        message: this.message,
        status: this.statusCode,
        details: this.errors,
        data: this.data
      }
    };
  }
}

module.exports = ApiError;
