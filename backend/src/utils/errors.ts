export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class AnalysisError extends AppError {
  constructor(message = "Analýza odpadu selhala") {
    super(message, 422);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Neplatný požadavek") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Zdroj nebyl nalezen") {
    super(message, 404);
  }
}
