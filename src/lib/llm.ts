/**
 * @fileoverview OpenRouter API client configuration and LLM integration utilities.
 * Provides a configured OpenAI client instance for making requests to OpenRouter.
 *
 * @module llm
 * @requires openai
 */

import OpenAI from "openai";
import { env } from "@/env.mjs";

// Types for OpenRouter specific configuration
interface OpenRouterConfig {
  apiKey: string;
  siteUrl?: string;
  siteName?: string;
  maxRetries?: number;
}

interface OpenRouterError extends Error {
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Creates a configured OpenAI client instance for OpenRouter
 * @param config OpenRouter configuration including API key and optional site details
 * @returns Configured OpenAI client instance
 */
export function createOpenRouterClient(config: OpenRouterConfig): OpenAI {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config.apiKey,
    defaultHeaders: {
      "HTTP-Referer": config.siteUrl || env.NEXT_PUBLIC_APP_URL || "",
      "X-Title": config.siteName || env.NEXT_PUBLIC_APP_NAME || "",
    },
    maxRetries: config.maxRetries || 3,
    timeout: 30000, // 30 second timeout
  });
}

// Export singleton instance for use across the application
let openRouterClient: OpenAI | null = null;

/**
 * Gets or creates a singleton OpenRouter client instance
 * @param config OpenRouter configuration
 * @returns OpenRouter client instance
 */
export function getOpenRouterClient(config: OpenRouterConfig): OpenAI {
  if (!openRouterClient) {
    openRouterClient = createOpenRouterClient(config);
  }
  return openRouterClient;
}

/**
 * Resets the OpenRouter client instance
 * Useful when API key changes or when testing
 */
export function resetOpenRouterClient(): void {
  openRouterClient = null;
}

/**
 * Helper function to create a streaming chat completion
 * @param client OpenAI client instance
 * @param params Chat completion parameters
 * @returns AsyncGenerator for streaming responses
 */
export async function* createStreamingCompletion(
  client: OpenAI,
  params: OpenAI.Chat.ChatCompletionCreateParams
): AsyncGenerator<string, void, unknown> {
  const stream = await client.chat.completions.create({
    ...params,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

/**
 * Error handler for OpenRouter API errors
 * @param error Error object from OpenRouter API
 * @returns Formatted error message
 */
export function handleOpenRouterError(error: OpenRouterError): string {
  switch (error.status) {
    case 401:
      return "Invalid API key. Please check your OpenRouter API key.";
    case 403:
      return "Access forbidden. Please check your API key permissions.";
    case 404:
      return "The requested resource was not found.";
    case 429:
      return "Rate limit exceeded. Please try again later.";
    case 500:
      return "OpenRouter server error. Please try again later.";
    default:
      const requestId = error.headers?.["x-request-id"];
      const message = error.message || "Unknown error occurred";
      return requestId ? `Error: ${message} (Request ID: ${requestId})` : `Error: ${message}`;
  }
} 