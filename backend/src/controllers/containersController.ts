import type { Request, Response } from "express";
import { CONTAINERS } from "../data/containers";
import { NotFoundError } from "../utils/errors";

export async function getAllContainers(_req: Request, res: Response) {
  res.json(CONTAINERS);
}

export async function getContainer(req: Request, res: Response) {
  const container = CONTAINERS.find((item) => item.type === req.params.type);

  if (!container) {
    throw new NotFoundError("Kontejner nebyl nalezen");
  }

  res.json(container);
}
