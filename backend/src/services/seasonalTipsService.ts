import { seasonalTipFallbacks } from "../data/seasonalTips";
import type { Season, SeasonalTipsResponse, TipResponse } from "../types";
import { AnalysisError } from "../utils/errors";
import { getLlmService } from "./llm/llmService";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const seasonalEmojis: Record<Season, string> = {
  spring: "🌱",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

const seasonNames: Record<Season, string> = {
  spring: "jaro",
  summer: "léto",
  autumn: "podzim",
  winter: "zima",
};

const cache = new Map<
  Season,
  {
    expiresAt: number;
    response: SeasonalTipsResponse;
  }
>();

function getCurrentSeason(date: Date): Season {
  const month = date.getMonth();

  if (month >= 2 && month <= 4) {
    return "spring";
  }

  if (month >= 5 && month <= 7) {
    return "summer";
  }

  if (month >= 8 && month <= 10) {
    return "autumn";
  }

  return "winter";
}

function buildFallbackTips(season: Season): SeasonalTipsResponse {
  return {
    season,
    aiGenerated: false,
    tips: seasonalTipFallbacks[season].map((tip) => ({
      ...tip,
      type: "seasonal",
      season,
      aiGenerated: false,
    })),
  };
}

function parseSeasonalTips(content: string, season: Season): TipResponse[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new AnalysisError("Sezónní tipy z AI nejsou validní JSON.");
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as { tips?: unknown }).tips)) {
    throw new AnalysisError("Sezónní tipy z AI nemají očekávaný tvar.");
  }

  const tips = (parsed as { tips: unknown[] }).tips;

  if (tips.length !== 5) {
    throw new AnalysisError("AI musí vrátit přesně 5 sezónních tipů.");
  }

  return tips.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new AnalysisError("AI vrátila neplatnou položku sezónního tipu.");
    }

    const candidate = item as Record<string, unknown>;

    if (typeof candidate.title !== "string" || typeof candidate.content !== "string") {
      throw new AnalysisError("AI vrátila sezónní tip bez titulku nebo obsahu.");
    }

    return {
      id: `seasonal-${season}-${index + 1}`,
      title: candidate.title.trim(),
      content: candidate.content.trim(),
      emoji:
        typeof candidate.emoji === "string" && candidate.emoji.trim()
          ? candidate.emoji.trim()
          : seasonalEmojis[season],
      source: "openai",
      type: "seasonal",
      season,
      aiGenerated: true,
    };
  });
}

async function generateSeasonalTipsWithAi(season: Season): Promise<SeasonalTipsResponse> {
  const llmService = getLlmService();

  if (!llmService.isConfigured()) {
    return buildFallbackTips(season);
  }

  const content = await llmService.generateText({
    systemPrompt: `Jsi odborník na třídění odpadu v České republice.
Generuješ praktické a edukativní tipy v češtině s diakritikou.
Odpověz výhradně jako validní JSON objekt bez markdown v tomto tvaru:
{
  "tips": [
    {
      "title": "Krátký český titulek",
      "content": "2-3 věty s konkrétním doporučením pro třídění odpadu v ČR.",
      "emoji": "Jedno vhodné emoji"
    }
  ]
}`,
    userPrompt: `Vygeneruj přesně 5 různých praktických a edukativních tipů pro období ${seasonNames[season]}.
Každý tip musí být konkrétní pro třídění odpadu v ČR, v češtině s diakritikou a bez opakování.`,
  });

  return {
    season,
    aiGenerated: true,
    tips: parseSeasonalTips(content, season),
  };
}

export async function getSeasonalTips(date = new Date()): Promise<SeasonalTipsResponse> {
  const season = getCurrentSeason(date);
  const cached = cache.get(season);

  if (cached && cached.expiresAt > date.getTime()) {
    return cached.response;
  }

  try {
    const response = await generateSeasonalTipsWithAi(season);

    cache.set(season, {
      expiresAt: date.getTime() + CACHE_TTL_MS,
      response,
    });

    return response;
  } catch {
    const response = buildFallbackTips(season);

    cache.set(season, {
      expiresAt: date.getTime() + CACHE_TTL_MS,
      response,
    });

    return response;
  }
}

export function isSeasonalTipDay(date = new Date()): boolean {
  const dayNumber = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  return dayNumber % 2 === 1;
}

export function getSeasonalTipForDay(
  tipsResponse: SeasonalTipsResponse,
  date = new Date(),
): TipResponse {
  const dayNumber = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  const index = Math.abs(dayNumber) % tipsResponse.tips.length;
  return tipsResponse.tips[index];
}
