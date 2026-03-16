import type { Request, Response } from "express";
import {
  clearWasteHistory,
  deleteWasteById,
  getWasteHistory,
} from "../services/wasteService";
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

function parsePositiveInt(value: unknown, fallback: number) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError("page and limit must be positive integers");
  }

  return parsed;
}

function parseContainer(value: unknown): ContainerType | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || !validContainers.has(value as ContainerType)) {
    throw new ValidationError("container must be a valid waste container type");
  }

  return value as ContainerType;
}

export async function getHistory(req: Request, res: Response) {
  const search =
    typeof req.query.search === "string" && req.query.search.trim() !== ""
      ? req.query.search.trim()
      : undefined;
  const container = parseContainer(req.query.container);
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parsePositiveInt(req.query.limit, 50);

  const history = await getWasteHistory({
    search,
    container,
    page,
    limit,
  });

  res.json(history);
}

export async function deleteHistoryItem(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new ValidationError("History item id is required");
  }

  await deleteWasteById(id);

  res.json({
    success: true,
    message: "Zaznam smazan",
  });
}

export async function clearHistory(req: Request, res: Response) {
  if (req.query.confirm !== "true") {
    throw new ValidationError("confirm=true is required to clear history");
  }

  const deletedCount = await clearWasteHistory();

  res.json({
    success: true,
    message: "Historie vymazana",
    deletedCount,
  });
}
