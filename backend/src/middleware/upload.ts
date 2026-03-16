import { randomUUID } from "crypto";
import multer from "multer";
import path from "path";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".bin";
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error("Only JPEG, PNG, and WebP files are allowed"));
  },
});
