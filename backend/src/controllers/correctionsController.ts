import type { Request, Response } from "express";
import { getAllCorrections, submitWasteCorrection } from "../services/wasteService";
import type { ContainerType } from "../types";
import { ValidationError } from "../utils/errors";

const validContainers = new Set<ContainerType>([
  "plastic",
  "paper",
  "glass",
  "mixed",
  "bio",
  "metal",
  "hazardous",
  "electro",
  "carton",
]);

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export async function submitCorrection(req: Request, res: Response) {
  const wasteId = normalizeOptionalString(req.body?.wasteId);
  const correctedName = normalizeOptionalString(req.body?.correctedName);
  const correctedContainerValue = normalizeOptionalString(req.body?.correctedContainer);
  const note = normalizeOptionalString(req.body?.note);

  if (!wasteId) {
    throw new ValidationError("wasteId is required");
  }

  if (!correctedName && !correctedContainerValue) {
    throw new ValidationError(
      "At least one of correctedName or correctedContainer must be provided",
    );
  }

  if (
    correctedContainerValue &&
    !validContainers.has(correctedContainerValue as ContainerType)
  ) {
    throw new ValidationError("correctedContainer must be a valid waste container type");
  }

  const result = await submitWasteCorrection({
    wasteId,
    correctedName,
    correctedContainer: correctedContainerValue as ContainerType | undefined,
    note,
  });

  res.status(201).json({
    success: true,
    correction: result.correction,
    updatedWaste: result.updatedWaste,
  });
}

export async function getCorrections(_req: Request, res: Response) {
  const corrections = await getAllCorrections();
  res.json(corrections);
}
