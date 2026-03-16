import { PrismaClient } from "@prisma/client";
import type { ContainerType, WasteItem } from "../types";

const prisma = new PrismaClient();

function parseStringArray(value: string) {
  const parsed = JSON.parse(value);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

function mapRecordToWasteItem(record: {
  id: string;
  name: string;
  description: string;
  containers: string;
  primaryContainer: string;
  imageUrl: string;
  composition: string;
  disposalInstructions: string;
  decompositionTime: string;
  funFact: string;
  labelInfo: string | null;
  isHazardous: boolean;
  similarWasteIds: string;
  scannedAt: Date;
  userCorrected: boolean;
}): WasteItem {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    containers: parseStringArray(record.containers) as ContainerType[],
    primaryContainer: record.primaryContainer as ContainerType,
    imageUrl: record.imageUrl,
    composition: record.composition,
    disposalInstructions: record.disposalInstructions,
    decompositionTime: record.decompositionTime,
    funFact: record.funFact,
    labelInfo: record.labelInfo ?? undefined,
    isHazardous: record.isHazardous,
    similarWasteIds: parseStringArray(record.similarWasteIds),
    scannedAt: record.scannedAt.toISOString(),
    userCorrected: record.userCorrected,
  };
}

export async function saveWasteRecord(waste: WasteItem): Promise<WasteItem> {
  const record = await prisma.wasteRecord.create({
    data: {
      id: waste.id,
      name: waste.name,
      description: waste.description,
      containers: JSON.stringify(waste.containers),
      primaryContainer: waste.primaryContainer,
      imageUrl: waste.imageUrl,
      composition: waste.composition,
      disposalInstructions: waste.disposalInstructions,
      decompositionTime: waste.decompositionTime,
      funFact: waste.funFact,
      labelInfo: waste.labelInfo ?? null,
      isHazardous: waste.isHazardous,
      similarWasteIds: JSON.stringify(waste.similarWasteIds),
      scannedAt: new Date(waste.scannedAt),
      userCorrected: waste.userCorrected,
    },
  });

  return mapRecordToWasteItem(record);
}

export async function getWasteById(id: string): Promise<WasteItem | null> {
  const record = await prisma.wasteRecord.findUnique({
    where: { id },
  });

  return record ? mapRecordToWasteItem(record) : null;
}

export async function findSimilarWaste(
  container: ContainerType,
  excludeId: string,
  limit: number,
): Promise<WasteItem[]> {
  const records = await prisma.wasteRecord.findMany({
    where: {
      primaryContainer: container,
      id: {
        not: excludeId,
      },
    },
    orderBy: {
      scannedAt: "desc",
    },
    take: limit,
  });

  return records.map(mapRecordToWasteItem);
}
