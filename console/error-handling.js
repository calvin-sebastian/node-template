// CustomError is a custom class that extends the built-in Error class.
// It adds a statusCode property that can be used to store an HTTP status code.
export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor with the message parameter
    this.statusCode = statusCode; // Add a statusCode property
  }
}

// ValidationError is a custom error that represents a validation error.
// It always has a status code of 422.
export class ValidationError extends CustomError {
  constructor(message) {
    super(message, 422); // Call the parent constructor with the message and a status code of 422
  }
}

// ConflictError is a custom error that represents a conflict error.
// It always has a status code of 409.
export class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409); // Call the parent constructor with the message and a status code of 409
  }
}

// InternalServerError is a custom error that represents an internal server error.
// It always has a status code of 500.
export class InternalServerError extends CustomError {
  constructor(message) {
    super(message, 500); // Call the parent constructor with the message and a status code of 500
  }
}
