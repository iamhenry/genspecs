/**
 * @fileoverview OpenRouter API client configuration and LLM integration utilities.
 * Provides a configured OpenAI client instance for making requests to OpenRouter.
 *
 * @module llm
 * @requires openai
 */

import OpenAI from "openai";
import { GenerationState, DocumentState, DocumentStatus } from '@/types/generation';

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
      "HTTP-Referer": config.siteUrl || "",
      "X-Title": config.siteName || "GenSpecs",
    },
    maxRetries: config.maxRetries || 3,
    timeout: 30000, // 30 second timeout
    dangerouslyAllowBrowser: true // Enable browser usage
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

/**
 * Generates a README document based on project details using OpenRouter API
 * @param projectDetails Project information including name, description, and user stories
 * @param existingContent Optional existing README content to preserve on error
 * @returns Generated README content and status
 */
export async function generateReadme(
  projectDetails: GenerationState['projectDetails'],
  existingContent?: string,
  apiKey?: string
): Promise<DocumentState> {
  console.log('Starting README generation with:', {
    name: projectDetails.name,
    description: projectDetails.description,
    userStoriesCount: projectDetails.userStories.length
  });

  // Validate required fields
  if (!projectDetails.name) {
    console.error('README generation failed: Project name is required');
    throw new Error('Project name is required');
  }

  if (!projectDetails.description) {
    console.error('README generation failed: Project description is required');
    throw new Error('Project description is required');
  }

  if (!apiKey) {
    console.error('README generation failed: API key is required');
    throw new Error('OpenRouter API key is required');
  }

  try {
    console.log('Using API key:', apiKey ? 'Present' : 'Missing');

    // In development, use direct OpenRouter API call
    if (process.env.NODE_ENV === 'development') {
      const client = getOpenRouterClient({
        apiKey,
        siteName: "GenSpecs",
      });

      console.log('Making OpenRouter API call with Claude 3.5 Sonnet...');

      const systemPrompt = `You are a technical documentation expert. Generate a comprehensive README.md file following this exact structure:

# [Project Name]

## Overview
[Brief project overview]

## Features
- [List of high level features]

## System Requirements

## Dependencies

## Architecture

## Core Components

Use the provided project details to populate the sections. Extract key information from the description and user stories to create a comprehensive README. Focus on technical accuracy and clarity.`;

      const userPrompt = `Please generate a README.md for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map(story => `- ${story}`).join('\n')}

Generate the README following the structure exactly as specified in the system prompt.`;

      console.log('Sending request with prompts:', { systemPrompt, userPrompt });

      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: "anthropic/claude-3.5-sonnet:beta",
        temperature: 0.7,
        max_tokens: 2000,
      });

      console.log('Received response:', response);
      const content = response.choices[0]?.message?.content || '';
      console.log('Generated README content:', content);

      return {
        type: 'readme' as const,
        content,
        status: 'draft' as DocumentStatus,
        lastUpdated: new Date(),
      };
    } 
    // In production, use the API route
    else {
      const response = await fetch('/api/generate/readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDetails,
          apiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate README');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Failed to generate README. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: (error as OpenRouterError).status,
      headers: (error as OpenRouterError).headers,
    });
    return {
      type: 'readme',
      content: existingContent || '',
      status: 'error',
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 