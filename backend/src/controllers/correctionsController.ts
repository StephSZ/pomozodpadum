import type { Request, Response } from "express";
import { getAllCorrections, submitWasteCorrection } from "../services/wasteService";
import type { ContainerType } from "../types";
import { ValidationError } from "../utils/errors";
import {
  assertContainerType,
  assertUuid,
  sanitizeStringInput,
} from "../middleware/validate";

export async function submitCorrection(req: Request, res: Response) {
  const rawWasteId = sanitizeStringInput(req.body?.wasteId, {
    maxLength: 36,
    required: true,
  });
  const correctedName = sanitizeStringInput(req.body?.correctedName, {
    maxLength: 120,
  });
  const correctedContainerValue = sanitizeStringInput(req.body?.correctedContainer, {
    maxLength: 20,
  });
  const note = sanitizeStringInput(req.body?.note, {
    maxLength: 600,
  });

  const wasteId = assertUuid(rawWasteId, "wasteId");

  if (!correctedName && !correctedContainerValue) {
    throw new ValidationError(
      "At least one of correctedName or correctedContainer must be provided",
    );
  }

  const correctedContainer = correctedContainerValue
    ? assertContainerType(correctedContainerValue, "correctedContainer")
    : undefined;

  const result = await submitWasteCorrection({
    wasteId,
    correctedName,
    correctedContainer,
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
