import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

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
  const tips = await prisma.dailyTip.findMany({
    orderBy: {
      id: "asc",
    },
  });

  if (tips.length === 0) {
    res.status(404).json({
      success: false,
      error: "No daily tips available",
    });
    return;
  }

  const todayIndex = getMondayBasedDayIndex(new Date()) % tips.length;

  res.json(tips[todayIndex]);
}
