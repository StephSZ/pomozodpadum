import { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Nahraný soubor překračuje limit 10 MB"
        : err.message;

    res.status(400).json({
      success: false,
      error: message,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({
      success: false,
      error: "Neplatné JSON tělo požadavku",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: err.message || "Interní chyba serveru",
  });
}
