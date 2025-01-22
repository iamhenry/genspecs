/**
 * @fileoverview Test suite for the Implementation Plan generation functionality.
 * Tests the generation of Implementation Plan documents using the OpenRouter API,
 * including success cases, error handling, and state management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOpenRouterClient } from '../llm';
import { GenerationState, DocumentState } from '@/types/generation';
import { ImplementationPlanGenerator } from '../generators/ImplementationPlanGenerator';
import type OpenAI from 'openai';

type ChatCompletion = OpenAI.Chat.ChatCompletion;

vi.mock('openai', () => {
  return {
    default: vi.fn(() => ({
      chat: {
        completions: {
          create: vi.fn()
        }
      }
    }))
  };
});

describe('Implementation Plan Generator', () => {
  const mockApiKey = 'test_key';
  const mockProjectDetails: GenerationState['projectDetails'] = {
    name: 'Test Project',
    description: 'A test project using Next.js and TypeScript with Tailwind CSS',
    userStories: [
      'As a user, I want to create projects',
      'As a user, I want to manage specifications'
    ],
  };

  const mockRoadmapState: DocumentState = {
    type: 'roadmap',
    content: '# Project Roadmap\n## Phase 1\n1. Setup\n2. Implementation',
    status: 'accepted',
    lastUpdated: new Date()
  };

  const mockImplementationPlanContent = `# Implementation Plan

## Phase 1: Setup
1. Initialize project
   - Install dependencies
   - Configure TypeScript

## Phase 2: Implementation
1. Core Features
   - User management
   - Project handling`;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: mockImplementationPlanContent } }]
    } as ChatCompletion);
  });

  // Scenario 3: Auto-generated implementation plan
  it('should automatically trigger implementation plan generation when roadmap is accepted', async () => {
    const generator = new ImplementationPlanGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockRoadmapState
    );

    const result = await generator.generate();

    expect(result).toBeDefined();
    expect(result.content).toBe(mockImplementationPlanContent);
    expect(result.status).toBe('accepted');
    expect(result.type).toBe('implementation');
  });

  it('should validate roadmap dependency before generation', async () => {
    const invalidRoadmapState: DocumentState = {
      ...mockRoadmapState,
      status: 'generating'
    };

    const generator = new ImplementationPlanGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      invalidRoadmapState
    );

    const result = await generator.generate();
    expect(result.status).toBe('error');
    expect(result.error).toBe('Cannot generate Implementation Plan: Roadmap generation has not completed successfully');
  });

  it('should handle API errors gracefully', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const generator = new ImplementationPlanGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockRoadmapState
    );

    const result = await generator.generate();

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API Error');
  });

  it('should maintain existing document state on error', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const existingContent = '# Existing Implementation Plan';
    const generator = new ImplementationPlanGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockRoadmapState
    );

    const result = await generator.generate(existingContent);

    expect(result.content).toBe(existingContent);
    expect(result.status).toBe('error');
  });
}); 