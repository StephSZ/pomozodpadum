import { readFile } from "fs/promises";
import type { Request, Response } from "express";
import { analyzeWasteImage } from "../services/aiService";
import { findSimilarWaste, saveWasteRecord } from "../services/wasteService";
import type { AnalyzeRequest } from "../types";
import { ValidationError } from "../utils/errors";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const base64Pattern =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)$/;
const maxFileSizeBytes = 10 * 1024 * 1024;

function validateBase64Image(image: string) {
  const match = image.match(base64Pattern);

  if (!match) {
    throw new ValidationError(
      "Obrázek musí být base64 data URL ve formátu JPEG, PNG nebo WebP",
    );
  }

  const mimeType = match[1];
  const base64Data = match[2].replace(/\s/g, "");
  const sizeInBytes = Buffer.byteLength(base64Data, "base64");

  if (!allowedMimeTypes.has(mimeType)) {
    throw new ValidationError("Podporované jsou pouze obrázky JPEG, PNG a WebP");
  }

  if (sizeInBytes > maxFileSizeBytes) {
    throw new ValidationError("Nahraný soubor překračuje limit 10 MB");
  }

  return image;
}

async function resolveImageFromRequest(req: Request) {
  if (req.file) {
    if (!allowedMimeTypes.has(req.file.mimetype)) {
      throw new ValidationError("Podporované jsou pouze obrázky JPEG, PNG a WebP");
    }

    if (req.file.size > maxFileSizeBytes) {
      throw new ValidationError("Nahraný soubor překračuje limit 10 MB");
    }

    const fileBuffer = await readFile(req.file.path);

    return {
      dataUrl: `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`,
      imageUrl: `uploads/${req.file.filename}`,
    };
  }

  const image = (req.body as AnalyzeRequest | undefined)?.image;

  if (!image || typeof image !== "string") {
    throw new ValidationError("Požadavek musí obsahovat nahraný obrázek nebo base64 obrázek");
  }

  return {
    dataUrl: validateBase64Image(image),
    imageUrl: image,
  };
}

export async function analyzeWaste(req: Request, res: Response) {
  const { dataUrl, imageUrl } = await resolveImageFromRequest(req);

  const waste = await analyzeWasteImage(dataUrl);
  const similarWaste = await findSimilarWaste(waste.primaryContainer, waste.id, 3);

  waste.similarWasteIds = similarWaste.map((item) => item.id);
  waste.imageUrl = imageUrl;

  const savedWaste = await saveWasteRecord(waste);

  res.status(201).json({
    success: true,
    waste: savedWaste,
  });
}
