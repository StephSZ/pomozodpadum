import type { Request, Response } from "express";
import { GLOSSARY_TERMS } from "../data/glossary";
import { NotFoundError, ValidationError } from "../utils/errors";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sortGlossaryTerms() {
  return [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term, "cs"));
}

export async function getGlossary(_req: Request, res: Response) {
  res.json(sortGlossaryTerms());
}

export async function searchGlossary(req: Request, res: Response) {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!query) {
    throw new ValidationError("Parametr q je povinný");
  }

  const normalizedQuery = normalizeText(query);
  const matchingTerms = sortGlossaryTerms().filter((item) => {
    const searchTarget = `${item.term} ${item.definition}`;
    return normalizeText(searchTarget).includes(normalizedQuery);
  });

  res.json(matchingTerms);
}

export async function getGlossaryTerm(req: Request, res: Response) {
  const glossaryTerm = GLOSSARY_TERMS.find((item) => item.id === req.params.id);

  if (!glossaryTerm) {
    throw new NotFoundError("Pojem ve slovníčku nebyl nalezen");
  }

  res.json(glossaryTerm);
}
