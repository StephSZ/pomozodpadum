export interface LlmGenerateRequest {
  systemPrompt: string;
  userPrompt: string;
  imageDataUrl?: string;
}

export interface LlmService {
  isConfigured(): boolean;
  generateText(request: LlmGenerateRequest): Promise<string>;
}
