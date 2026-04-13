import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { TipResponse } from "../types";
import {
  getSeasonalTipForDay,
  getSeasonalTips,
  isSeasonalTipDay,
} from "../services/seasonalTipsService";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getMondayBasedDayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "jaro";
  if (month >= 6 && month <= 8) return "léto";
  if (month >= 9 && month <= 11) return "podzim";
  return "zima";
}

async function generateAiTip(): Promise<TipResponse | null> {
  try {
    const season = getCurrentSeason();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: "Jsi expert na třídění odpadu v České republice. Odpovídáš vždy pouze v češtině. Generuješ krátké, praktické tipy o třídění odpadu."
        },
        {
          role: "user",
          content: `Vygeneruj jeden praktický tip o třídění odpadu vhodný pro ${season} v České republice. Tip musí být konkrétní, max 2 věty. Odpověz pouze textem tipu, bez uvozovek, bez nadpisu.`
        }
      ]
    });
    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) return null;
    return {
      id: "ai-generated",
      emoji: "💡",
      title: "Víte, že...?",
      content,
      type: "daily",
      season: null,
      aiGenerated: true,
    };
  } catch (error) {
    console.error("OpenAI tip generation failed:", error);
    return null;
  }
}

export async function getAllTips(_req: Request, res: Response) {
  const tips = await prisma.dailyTip.findMany({
    orderBy: {
      id: "asc",
    },
  });

  res.json(tips);
}

export async function getTodayTip(_req: Request, res: Response) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.startsWith("sk-")) {
    const aiTip = await generateAiTip();
    if (aiTip) {
      res.json(aiTip);
      return;
    }
  }
  const now = new Date();
  if (isSeasonalTipDay(now)) {
    const seasonalTips = await getSeasonalTips(now);
    res.json(getSeasonalTipForDay(seasonalTips, now));
    return;
  }
  const tips = await prisma.dailyTip.findMany({ orderBy: { id: "asc" } });
  if (tips.length === 0) {
    res.status(404).json({ success: false, error: "Denní tipy nejsou k dispozici" });
    return;
  }
  const todayIndex = getMondayBasedDayIndex(now) % tips.length;
  const todayTip = tips[todayIndex];
  const tip: TipResponse = {
    ...todayTip,
    source: todayTip.source ?? undefined,
    type: "daily",
    season: null,
    aiGenerated: false,
  };
  res.json(tip);
}

export async function getCurrentSeasonalTips(_req: Request, res: Response) {
  const seasonalTips = await getSeasonalTips();
  res.json(seasonalTips);
}
