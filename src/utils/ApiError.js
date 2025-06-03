export class ApiError extends Error {
  constructor(statusCode, message, originalError = null) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = 'ApiError';
  }
} 