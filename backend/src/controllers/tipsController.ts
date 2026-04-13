import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { TipResponse } from "../types";
import {
  getSeasonalTipForDay,
  getSeasonalTips,
  isSeasonalTipDay,
} from "../services/seasonalTipsService";

const prisma = new PrismaClient();

function getMondayBasedDayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
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
  const now = new Date();
  if (isSeasonalTipDay(now)) {
    const seasonalTips = await getSeasonalTips(now);
    res.json(getSeasonalTipForDay(seasonalTips, now));
    return;
  }
  const tips = await prisma.dailyTip.findMany({
    orderBy: { id: "asc" },
  });
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
