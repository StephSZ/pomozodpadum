import { OpenAiLlmAdapter } from "./openAiLlmAdapter";
import type { LlmService } from "./types";

let llmService: LlmService | undefined;

export function getLlmService(): LlmService {
  if (!llmService) {
    llmService = new OpenAiLlmAdapter();
  }

  return llmService;
}
