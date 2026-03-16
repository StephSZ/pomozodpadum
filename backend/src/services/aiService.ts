import { randomUUID } from "crypto";
import OpenAI from "openai";
import type { ContainerType, WasteItem } from "../types";
import { AnalysisError, ValidationError } from "../utils/errors";

const systemPrompt = `Jsi expert na trideni odpadu v Ceske republice. Uzivatel ti posle fotku odpadu.

Tvym ukolem je:
1. Rozpoznat predmet na fotce
2. Precist etiketu, pokud je viditelna (OCR)
3. Urcit do jakeho kontejneru nebo kontejneru odpad patri
4. Poskytnout instrukce k likvidaci

Kategorie kontejneru: plastic, paper, glass, mixed, bio, metal, hazardous, electro, carton

Odpovez VYHRADNE jako validni JSON objekt bez markdown:
{
  "name": "Nazev odpadu cesky",
  "description": "Kratky popis cesky",
  "containers": ["primary_container", "optional_secondary"],
  "primaryContainer": "hlavni kontejner",
  "composition": "Z ceho se sklada",
  "disposalInstructions": "Jak spravne vyhodit - instrukce cesky",
  "decompositionTime": "Doba rozkladu",
  "funFact": "Zajimavost o tomto odpadu cesky",
  "labelInfo": "Text z etikety pokud je citelny, jinak null",
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
    name: "PET lahev",
    description: "Plastova lahev od napoje vhodna do zluteho kontejneru.",
    containers: ["plastic"],
    primaryContainer: "plastic",
    composition: "PET plast",
    disposalInstructions: "Vylijte zbytky, seslapnete a vyhodte do plastu.",
    decompositionTime: "450 let",
    funFact: "Z recyklovanych PET lahvi mohou vznikat textilni vlakna.",
    labelInfo: "Napojova etiketa",
    isHazardous: false,
  },
  {
    name: "Plechovka od napoje",
    description: "Hlinikova plechovka vhodna do sberu kovu.",
    containers: ["metal"],
    primaryContainer: "metal",
    composition: "Hlinik",
    disposalInstructions: "Vyplachnete, seslapnete a odlozte do kontejneru na kov.",
    decompositionTime: "200 let",
    funFact: "Hlinik lze recyklovat opakovane s nizkou ztratou kvality.",
    labelInfo: "Plechovka 0,33 l",
    isHazardous: false,
  },
  {
    name: "Sklenena lahev",
    description: "Sklenena lahev urcena do zeleneho kontejneru na sklo.",
    containers: ["glass"],
    primaryContainer: "glass",
    composition: "Sklo",
    disposalInstructions: "Sundejte uzaver a vyhodte lahev do skla.",
    decompositionTime: "4000 let",
    funFact: "Sklo je mozne recyklovat opakovane bez ztraty kvality.",
    labelInfo: "Sklenena lahev",
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
    throw new AnalysisError("AI response was not valid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new AnalysisError("AI response was not an object");
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
    throw new AnalysisError("AI response was missing required fields");
  }

  if (candidate.containers.length === 0) {
    throw new AnalysisError("AI response did not include any containers");
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
                text: "Analyzuj tuto fotku odpadu a vrat pozadovany JSON.",
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
        throw new AnalysisError("AI response was empty");
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
        error instanceof Error ? error : new AnalysisError("Unknown AI analysis error");
    }
  }

  if (lastError instanceof ValidationError) {
    throw lastError;
  }

  throw new AnalysisError(lastError?.message ?? "Waste analysis failed");
}
