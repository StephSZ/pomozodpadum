import type { Request, Response } from "express";
import { getWasteById } from "../services/wasteService";
import { NotFoundError } from "../utils/errors";

export async function getWaste(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new NotFoundError("Záznam odpadu nebyl nalezen");
  }

  const waste = await getWasteById(id);

  if (!waste) {
    throw new NotFoundError("Záznam odpadu nebyl nalezen");
  }

  res.json(waste);
}
