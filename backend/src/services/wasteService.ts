import { PrismaClient } from "@prisma/client";
import type { ContainerType, UserCorrection, WasteItem } from "../types";
import { NotFoundError } from "../utils/errors";

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

function mapCorrectionToDto(record: {
  id: string;
  wasteId: string;
  correctedName: string | null;
  correctedContainer: string | null;
  note: string | null;
  submittedAt: Date;
}): UserCorrection {
  return {
    id: record.id,
    wasteId: record.wasteId,
    correctedName: record.correctedName ?? undefined,
    correctedContainer: (record.correctedContainer as ContainerType | null) ?? undefined,
    note: record.note ?? undefined,
    submittedAt: record.submittedAt.toISOString(),
  };
}

export interface HistoryQueryOptions {
  search?: string;
  container?: ContainerType;
  page: number;
  limit: number;
}

export interface HistoryQueryResult {
  items: WasteItem[];
  total: number;
  page: number;
  totalPages: number;
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

export async function getWasteHistory(
  options: HistoryQueryOptions,
): Promise<HistoryQueryResult> {
  const where = {
    ...(options.search
      ? {
          name: {
            contains: options.search,
          },
        }
      : {}),
    ...(options.container
      ? {
          primaryContainer: options.container,
        }
      : {}),
  };

  const [total, records] = await Promise.all([
    prisma.wasteRecord.count({ where }),
    prisma.wasteRecord.findMany({
      where,
      orderBy: {
        scannedAt: "desc",
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    }),
  ]);

  return {
    items: records.map(mapRecordToWasteItem),
    total,
    page: options.page,
    totalPages: total === 0 ? 0 : Math.ceil(total / options.limit),
  };
}

export async function deleteWasteById(id: string) {
  const existingRecord = await prisma.wasteRecord.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingRecord) {
    throw new NotFoundError("Záznam odpadu nebyl nalezen");
  }

  await prisma.wasteRecord.delete({
    where: { id },
  });
}

export async function clearWasteHistory() {
  const result = await prisma.wasteRecord.deleteMany();
  return result.count;
}

export interface CorrectionInput {
  wasteId: string;
  correctedName?: string;
  correctedContainer?: ContainerType;
  note?: string;
}

export async function submitWasteCorrection(input: CorrectionInput) {
  const existingRecord = await prisma.wasteRecord.findUnique({
    where: { id: input.wasteId },
  });

  if (!existingRecord) {
    throw new NotFoundError("Záznam odpadu nebyl nalezen");
  }

  const [correction, updatedRecord] = await prisma.$transaction([
    prisma.userCorrection.create({
      data: {
        wasteId: input.wasteId,
        correctedName: input.correctedName ?? null,
        correctedContainer: input.correctedContainer ?? null,
        note: input.note ?? null,
      },
    }),
    prisma.wasteRecord.update({
      where: { id: input.wasteId },
      data: {
        userCorrected: true,
        ...(input.correctedName ? { name: input.correctedName } : {}),
        ...(input.correctedContainer
          ? {
              primaryContainer: input.correctedContainer,
              containers: JSON.stringify([input.correctedContainer]),
            }
          : {}),
      },
    }),
  ]);

  return {
    correction: mapCorrectionToDto(correction),
    updatedWaste: mapRecordToWasteItem(updatedRecord),
  };
}

export async function getAllCorrections(): Promise<UserCorrection[]> {
  const corrections = await prisma.userCorrection.findMany({
    orderBy: {
      submittedAt: "desc",
    },
  });

  return corrections.map(mapCorrectionToDto);
}
