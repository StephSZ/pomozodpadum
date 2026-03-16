import { randomUUID } from "crypto";
import OpenAI from "openai";
import type { ContainerType, WasteItem } from "../types";
import { AnalysisError, ValidationError } from "../utils/errors";

const systemPrompt = `Jsi expert na třídění odpadu v České republice. Uživatel ti pošle fotku odpadu.

Tvým úkolem je:
1. Rozpoznat předmět na fotce
2. Přečíst etiketu, pokud je viditelná (OCR)
3. Určit, do jakého kontejneru nebo kontejnerů odpad patří
4. Poskytnout instrukce k likvidaci

Kategorie kontejneru: plastic, paper, glass, mixed, bio, metal, hazardous, electro, carton

Odpověz VÝHRADNĚ jako validní JSON objekt bez markdown:
{
  "name": "Název odpadu česky",
  "description": "Krátký popis česky",
  "containers": ["primary_container", "optional_secondary"],
  "primaryContainer": "hlavní kontejner",
  "composition": "Z čeho se skládá",
  "disposalInstructions": "Jak správně vyhodit - instrukce česky",
  "decompositionTime": "Doba rozkladu",
  "funFact": "Zajímavost o tomto odpadu česky",
  "labelInfo": "Text z etikety pokud je čitelný, jinak null",
  "isHazardous": false,
  "similarWasteIds": []
}`;

const validContainers: ContainerType[] = [
  "plastic",
  "paper",
  "glass",
  "mixed",
  "bio",
  "metal",
  "hazardous",
  "electro",
  "carton",
];

const mockWasteSamples: Array<
  Omit<
    WasteItem,
    "id" | "imageUrl" | "scannedAt" | "userCorrected" | "similarWasteIds"
  >
> = [
  {
    name: "PET láhev",
    description: "Plastová láhev od nápoje vhodná do žlutého kontejneru.",
    containers: ["plastic"],
    primaryContainer: "plastic",
    composition: "PET plast",
    disposalInstructions: "Vylijte zbytky, sešlápněte a vyhoďte do plastu.",
    decompositionTime: "450 let",
    funFact: "Z recyklovaných PET lahví mohou vznikat textilní vlákna.",
    labelInfo: "Nápojová etiketa",
    isHazardous: false,
  },
  {
    name: "Plechovka od nápoje",
    description: "Hliníková plechovka vhodná do sběru kovů.",
    containers: ["metal"],
    primaryContainer: "metal",
    composition: "Hliník",
    disposalInstructions: "Vypláchněte, sešlápněte a odložte do kontejneru na kov.",
    decompositionTime: "200 let",
    funFact: "Hliník lze recyklovat opakovaně s nízkou ztrátou kvality.",
    labelInfo: "Plechovka 0,33 l",
    isHazardous: false,
  },
  {
    name: "Skleněná láhev",
    description: "Skleněná láhev určená do zeleného kontejneru na sklo.",
    containers: ["glass"],
    primaryContainer: "glass",
    composition: "Sklo",
    disposalInstructions: "Sundejte uzávěr a vyhoďte láhev do skla.",
    decompositionTime: "4000 let",
    funFact: "Sklo je možné recyklovat opakovaně bez ztráty kvality.",
    labelInfo: "Skleněná láhev",
    isHazardous: false,
  },
];

type AiWastePayload = Pick<
  WasteItem,
  | "name"
  | "description"
  | "containers"
  | "primaryContainer"
  | "composition"
  | "disposalInstructions"
  | "decompositionTime"
  | "funFact"
  | "labelInfo"
  | "isHazardous"
  | "similarWasteIds"
>;

function isContainerType(value: unknown): value is ContainerType {
  return typeof value === "string" && validContainers.includes(value as ContainerType);
}

function createMockWaste(): WasteItem {
  const mock = mockWasteSamples[Math.floor(Math.random() * mockWasteSamples.length)];

  return {
    ...mock,
    id: randomUUID(),
    imageUrl: "",
    scannedAt: new Date().toISOString(),
    userCorrected: false,
    similarWasteIds: [],
  };
}

function parseAiResponse(content: string): AiWastePayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new AnalysisError("Odpověď AI nebyla validní JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new AnalysisError("Odpověď AI neměla očekávaný objekt.");
  }

  const candidate = parsed as Record<string, unknown>;

  if (
    typeof candidate.name !== "string" ||
    typeof candidate.description !== "string" ||
    !Array.isArray(candidate.containers) ||
    !candidate.containers.every(isContainerType) ||
    !isContainerType(candidate.primaryContainer) ||
    typeof candidate.composition !== "string" ||
    typeof candidate.disposalInstructions !== "string" ||
    typeof candidate.decompositionTime !== "string" ||
    typeof candidate.funFact !== "string" ||
    !(typeof candidate.labelInfo === "string" || candidate.labelInfo === null) ||
    typeof candidate.isHazardous !== "boolean" ||
    !Array.isArray(candidate.similarWasteIds) ||
    !candidate.similarWasteIds.every((item) => typeof item === "string")
  ) {
    throw new AnalysisError("Odpověď AI neobsahovala všechna povinná pole.");
  }

  if (candidate.containers.length === 0) {
    throw new AnalysisError("Odpověď AI neobsahovala žádný kontejner.");
  }

  return {
    name: candidate.name,
    description: candidate.description,
    containers: candidate.containers,
    primaryContainer: candidate.primaryContainer,
    composition: candidate.composition,
    disposalInstructions: candidate.disposalInstructions,
    decompositionTime: candidate.decompositionTime,
    funFact: candidate.funFact,
    labelInfo: candidate.labelInfo ?? undefined,
    isHazardous: candidate.isHazardous,
    similarWasteIds: candidate.similarWasteIds,
  };
}

export async function analyzeWasteImage(imageBase64: string): Promise<WasteItem> {
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!openAiApiKey || openAiApiKey === "your_openai_api_key_here") {
    return createMockWaste();
  }

  const openai = new OpenAI({ apiKey: openAiApiKey });

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyzuj tuto fotku odpadu a vrať požadovaný JSON.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const messageContent = response.choices[0]?.message?.content;

      if (!messageContent) {
        throw new AnalysisError("Odpověď AI byla prázdná.");
      }

      const parsed = parseAiResponse(messageContent);

      return {
        ...parsed,
        id: randomUUID(),
        imageUrl: "",
        scannedAt: new Date().toISOString(),
        userCorrected: false,
        similarWasteIds: [],
      };
    } catch (error) {
      lastError =
        error instanceof Error ? error : new AnalysisError("Nastala neznámá chyba AI analýzy.");
    }
  }

  if (lastError instanceof ValidationError) {
    throw lastError;
  }

  throw new AnalysisError(lastError?.message ?? "Analýza odpadu selhala.");
}
