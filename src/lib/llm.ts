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
        status: 'accepted' as DocumentStatus,
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

/**
 * Generates a Bill of Materials (BOM) document based on project details using OpenRouter API
 * @param projectDetails Project information including name, description, and user stories
 * @param readmeState Current state of README document generation
 * @param apiKey OpenRouter API key
 * @param existingContent Optional existing BOM content to preserve on error
 * @returns Generated BOM content and status
 */
export async function generateBom(
  projectDetails: GenerationState['projectDetails'],
  readmeState: DocumentState,
  apiKey: string,
  existingContent?: string
): Promise<DocumentState> {
  console.log('Starting BOM generation with:', {
    name: projectDetails.name,
    description: projectDetails.description,
    userStoriesCount: projectDetails.userStories.length,
    readmeStatus: readmeState.status
  });

  // Check README generation status
  if (readmeState.status !== 'accepted') {
    console.error('BOM generation failed: README generation not completed');
    throw new Error('Cannot generate BOM: README generation has not completed successfully');
  }

  if (!apiKey) {
    console.error('BOM generation failed: API key is required');
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

      const systemPrompt = `You are a technical documentation expert. Generate a Bill of Materials (BOM) document following this exact structure:

#### Bill of Materials

1. Components
   1. Core Features
   2. Supporting Features
2. Technical Stack
   1. Frontend
   2. Backend
   3. Utilities
3. Dependencies
   1. Core Libraries
   2. Third-party Dependencies
4. Functional Requirements
   1. MVP Core Functionalities

Extract information from the project details to populate each section. Focus on technical accuracy and completeness.
Ensure all components, dependencies, and requirements are properly categorized.`;

      const userPrompt = `Please generate a Bill of Materials for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map(story => `- ${story}`).join('\n')}

Generate the BOM following the structure exactly as specified in the system prompt.
Analyze the project details to identify and categorize all technical components, dependencies, and requirements.`;

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
      console.log('Generated BOM content:', content);

      return {
        type: 'bom' as const,
        content,
        status: 'accepted' as DocumentStatus,
        lastUpdated: new Date(),
      };
    } 
    // In production, use the API route
    else {
      const response = await fetch('/api/generate/bom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDetails,
          readmeState,
          apiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate BOM');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Failed to generate BOM. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: (error as OpenRouterError).status,
      headers: (error as OpenRouterError).headers,
    });
    return {
      type: 'bom',
      content: existingContent || '',
      status: 'error',
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generates a Roadmap document based on project details using OpenRouter API
 * @param projectDetails Project information including name, description, and user stories
 * @param bomState Current state of BOM document generation
 * @param apiKey OpenRouter API key
 * @param existingContent Optional existing Roadmap content to preserve on error
 * @returns Generated Roadmap content and status
 */
export async function generateRoadmap(
  projectDetails: GenerationState['projectDetails'],
  bomState: DocumentState,
  apiKey: string,
  existingContent?: string
): Promise<DocumentState> {
  console.log('Starting Roadmap generation with:', {
    name: projectDetails.name,
    description: projectDetails.description,
    userStoriesCount: projectDetails.userStories.length,
    bomStatus: bomState.status
  });

  // Check BOM generation status
  if (bomState.status !== 'accepted') {
    console.error('Roadmap generation failed: BOM generation not completed');
    throw new Error('Cannot generate Roadmap: BOM generation has not completed successfully');
  }

  if (!apiKey) {
    console.error('Roadmap generation failed: API key is required');
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

      const systemPrompt = `You are a technical project planning expert. Generate a project roadmap following this exact structure:

# Project Roadmap

## Phase 1: Foundation
[Initial setup and core infrastructure tasks]

## Phase 2: Core Features
[Essential features and functionality]

## Phase 3: Advanced Features
[Additional features and enhancements]

## Phase 4: Polish & Launch
[Final improvements and launch preparation]

Extract information from the project details and BOM to create a comprehensive roadmap. Focus on logical progression and dependencies between phases.`;

      const userPrompt = `Please generate a Project Roadmap for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map(story => `- ${story}`).join('\n')}

BOM Content:
${bomState.content}

Generate the Roadmap following the structure exactly as specified in the system prompt.
Ensure proper sequencing of tasks and clear phase transitions.`;

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
      console.log('Generated Roadmap content:', content);

      return {
        type: 'roadmap' as const,
        content,
        status: 'accepted' as DocumentStatus,
        lastUpdated: new Date(),
      };
    } 
    // In production, use the API route
    else {
      const response = await fetch('/api/generate/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDetails,
          bomState,
          apiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate Roadmap');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Failed to generate Roadmap. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: (error as OpenRouterError).status,
      headers: (error as OpenRouterError).headers,
    });
    return {
      type: 'roadmap',
      content: existingContent || '',
      status: 'error',
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generates an Implementation Plan document based on project details using OpenRouter API
 * @param projectDetails Project information including name, description, and user stories
 * @param roadmapState Current state of Roadmap document generation
 * @param apiKey OpenRouter API key
 * @param existingContent Optional existing Implementation Plan content to preserve on error
 * @returns Generated Implementation Plan content and status
 */
export async function generateImplementationPlan(
  projectDetails: GenerationState['projectDetails'],
  roadmapState: DocumentState,
  apiKey: string,
  existingContent?: string
): Promise<DocumentState> {
  console.log('Starting Implementation Plan generation with:', {
    name: projectDetails.name,
    description: projectDetails.description,
    userStoriesCount: projectDetails.userStories.length,
    roadmapStatus: roadmapState.status
  });

  // Check Roadmap generation status
  if (roadmapState.status !== 'accepted') {
    console.error('Implementation Plan generation failed: Roadmap generation not completed');
    throw new Error('Cannot generate Implementation Plan: Roadmap generation has not completed successfully');
  }

  if (!apiKey) {
    console.error('Implementation Plan generation failed: API key is required');
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

      const systemPrompt = `You are a technical implementation planning expert. Generate a detailed implementation plan following this exact structure:

# Implementation Plan

## Phase Details

### Phase 1: [Phase Name]
1. [Task Group]
   - Detailed task description
   - Technical requirements
   - Dependencies
   - Estimated effort

[Repeat for each phase from the roadmap]

Extract information from the project details and roadmap to create a comprehensive implementation plan.
Focus on technical details, dependencies, and concrete implementation steps.`;

      const userPrompt = `Please generate an Implementation Plan for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map(story => `- ${story}`).join('\n')}

Roadmap Content:
${roadmapState.content}

Generate the Implementation Plan following the structure exactly as specified in the system prompt.
Break down each roadmap phase into detailed, actionable implementation tasks.`;

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
      console.log('Generated Implementation Plan content:', content);

      return {
        type: 'implementation' as const,
        content,
        status: 'accepted' as DocumentStatus,
        lastUpdated: new Date(),
      };
    } 
    // In production, use the API route
    else {
      const response = await fetch('/api/generate/implementation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDetails,
          roadmapState,
          apiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate Implementation Plan');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Failed to generate Implementation Plan. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: (error as OpenRouterError).status,
      headers: (error as OpenRouterError).headers,
    });
    return {
      type: 'implementation',
      content: existingContent || '',
      status: 'error',
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 