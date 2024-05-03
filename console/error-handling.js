export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends CustomError {
  constructor(message) {
    super(message, 422);
  }
}

export class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}
