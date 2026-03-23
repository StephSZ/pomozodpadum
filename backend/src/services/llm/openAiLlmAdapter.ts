import OpenAI from "openai";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { AnalysisError } from "../../utils/errors";
import type { LlmGenerateRequest, LlmService } from "./types";

function parseTemperature(rawValue: string | undefined): number {
  if (!rawValue) {
    return 0.2;
  }

  const value = Number(rawValue);

  if (Number.isNaN(value) || value < 0 || value > 2) {
    throw new AnalysisError("Konfigurace LLM obsahuje neplatnou temperature.");
  }

  return value;
}

function parseMaxTokens(rawValue: string | undefined): number | undefined {
  if (!rawValue) {
    return 800;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new AnalysisError("Konfigurace LLM obsahuje neplatne max_tokens.");
  }

  return value;
}

export class OpenAiLlmAdapter implements LlmService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly temperature: number;
  private readonly maxTokens: number | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
    this.model = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
    this.temperature = this.isConfigured() ? parseTemperature(process.env.OPENAI_TEMPERATURE) : 0.2;
    this.maxTokens = this.isConfigured() ? parseMaxTokens(process.env.OPENAI_MAX_TOKENS) : 800;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey) && this.apiKey !== "your_openai_api_key_here";
  }

  async generateText(request: LlmGenerateRequest): Promise<string> {
    if (!this.isConfigured()) {
      throw new AnalysisError("LLM provider neni nakonfigurovan.");
    }

    const openai = new OpenAI({ apiKey: this.apiKey });
    const content: ChatCompletionContentPart[] = [
      {
        type: "text",
        text: request.userPrompt,
      },
    ];

    if (request.imageDataUrl) {
      content.push({
        type: "image_url",
        image_url: {
          url: request.imageDataUrl,
        },
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: request.systemPrompt,
          },
          {
            role: "user",
            content,
          },
        ],
      });

      const messageContent = response.choices[0]?.message?.content;

      if (!messageContent) {
        throw new AnalysisError("LLM vratilo prazdnou odpoved.");
      }

      return messageContent;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AnalysisError(`Volani LLM selhalo: ${error.message}`);
      }

      throw new AnalysisError("Volani LLM selhalo bez detailu.");
    }
  }
}
