import type { Request, Response } from "express";
import {
  CATALOG_CATEGORIES,
  CATALOG_LETTERS,
  WASTE_CATALOG,
} from "../data/wasteCatalog";
import { NotFoundError } from "../utils/errors";

const letterOrder = new Map<string, number>(CATALOG_LETTERS.map((letter, index) => [letter, index]));

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function getCatalog(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const letter = typeof req.query.letter === "string" ? req.query.letter.trim().toLowerCase() : "";
  const category =
    typeof req.query.category === "string" ? normalizeText(req.query.category.trim()) : "";

  const filteredItems = WASTE_CATALOG.filter((item) => {
    if (search && !normalizeText(item.name).includes(normalizeText(search))) {
      return false;
    }

    if (letter && item.letter !== letter) {
      return false;
    }

    if (
      category &&
      !item.categories.some((itemCategory) => normalizeText(itemCategory) === category)
    ) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const letterDifference = (letterOrder.get(a.letter) ?? 0) - (letterOrder.get(b.letter) ?? 0);

    if (letterDifference !== 0) {
      return letterDifference;
    }

    return a.name.localeCompare(b.name, "cs");
  });

  res.json({
    items: filteredItems,
    total: filteredItems.length,
    letters: [...CATALOG_LETTERS],
    categories: CATALOG_CATEGORIES,
  });
}

export async function getCatalogItem(req: Request, res: Response) {
  const item = WASTE_CATALOG.find((catalogItem) => catalogItem.id === req.params.id);

  if (!item) {
    throw new NotFoundError("Položka katalogu nebyla nalezena");
  }

  res.json(item);
}
