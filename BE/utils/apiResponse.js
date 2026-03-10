class ApiResponse {
  constructor(message, data, statusCode) {
    this.message = message;       // Descriptive message
    this.data = data;             // Payload or result data
    this.statusCode = statusCode; // HTTP-like status code
  }

  toJSON() {
    return {
      response: {
        message: this.message,
        status: this.statusCode,
        data: this.data
      }
    };
  }

  // Helper method to check if response is successful
  isSuccess() {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  // Static factory methods for convenience
  static success(data, message = "Success") {
    return new ApiResponse(message, data, 200);
  }
}


module.exports = ApiResponse;