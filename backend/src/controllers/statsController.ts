import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { ContainerType } from "../types";

const prisma = new PrismaClient();

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function roundPercentage(value: number) {
  return Math.round(value * 10) / 10;
}

export async function getStats(_req: Request, res: Response) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const sixDaysAgo = addDays(todayStart, -6);
  const sevenDaysAgo = addDays(now, -7);

  const [totalScans, weeklyScans, groupedContainers, weeklyRecords] = await Promise.all([
    prisma.wasteRecord.count(),
    prisma.wasteRecord.count({
      where: {
        scannedAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.wasteRecord.groupBy({
      by: ["primaryContainer"],
      _count: {
        primaryContainer: true,
      },
      orderBy: {
        _count: {
          primaryContainer: "desc",
        },
      },
    }),
    prisma.wasteRecord.findMany({
      where: {
        scannedAt: {
          gte: sixDaysAgo,
        },
      },
      select: {
        scannedAt: true,
      },
    }),
  ]);

  const topContainer = groupedContainers[0]
    ? {
        container: groupedContainers[0].primaryContainer as ContainerType,
        count: groupedContainers[0]._count.primaryContainer,
      }
    : null;

  const containerDistribution = groupedContainers.map((group) => ({
    container: group.primaryContainer as ContainerType,
    count: group._count.primaryContainer,
    percentage:
      totalScans === 0
        ? 0
        : roundPercentage((group._count.primaryContainer / totalScans) * 100),
  }));

  const dailyCounts = new Map<string, number>();

  for (const record of weeklyRecords) {
    const key = formatDate(record.scannedAt);
    dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
  }

  const dailyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(sixDaysAgo, index);
    const key = formatDate(date);

    return {
      date: key,
      count: dailyCounts.get(key) ?? 0,
    };
  });

  res.json({
    totalScans,
    weeklyScans,
    topContainer,
    containerDistribution,
    dailyActivity,
  });
}
