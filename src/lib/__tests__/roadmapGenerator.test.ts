/**
 * @fileoverview Test suite for the Roadmap generation functionality.
 * Tests the generation of Roadmap documents using the OpenRouter API,
 * including success cases, error handling, and state management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOpenRouterClient } from '../llm';
import { GenerationState, DocumentState } from '@/types/generation';
import { RoadmapGenerator } from '../generators/RoadmapGenerator';
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

describe('Roadmap Generator', () => {
  const mockApiKey = 'test_key';
  const mockProjectDetails: GenerationState['projectDetails'] = {
    name: 'Test Project',
    description: 'A test project using Next.js and TypeScript with Tailwind CSS',
    userStories: [
      'As a user, I want to create projects',
      'As a user, I want to manage specifications'
    ],
  };

  const mockBomState: DocumentState = {
    type: 'bom',
    content: '# Test BOM\n## Components\n1. Core Features',
    status: 'accepted',
    lastUpdated: new Date()
  };

  const mockRoadmapContent = `# Project Roadmap

## Phase 1: Core Implementation
1. Setup Project Infrastructure
2. Implement Basic Features

## Phase 2: Advanced Features
1. Add User Management
2. Implement Specifications`;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: mockRoadmapContent } }]
    } as ChatCompletion);
  });

  it('should automatically trigger roadmap generation when BOM is accepted', async () => {
    const generator = new RoadmapGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockBomState
    );

    const result = await generator.generate();

    expect(result).toBeDefined();
    expect(result.content).toBe(mockRoadmapContent);
    expect(result.status).toBe('accepted');
    expect(result.type).toBe('roadmap');
  });

  it('should validate BOM dependency before generation', async () => {
    const invalidBomState: DocumentState = {
      ...mockBomState,
      status: 'generating'
    };

    const generator = new RoadmapGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      invalidBomState
    );

    const result = await generator.generate();
    expect(result.status).toBe('error');
    expect(result.error).toBe('BOM generation not completed');
  });

  it('should handle API errors gracefully', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const generator = new RoadmapGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockBomState
    );

    const result = await generator.generate();

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API Error');
  });

  it('should maintain existing document state on error', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const existingContent = '# Existing Roadmap';
    const generator = new RoadmapGenerator(
      { apiKey: mockApiKey },
      mockProjectDetails,
      mockBomState
    );

    const result = await generator.generate(existingContent);

    expect(result.content).toBe(existingContent);
    expect(result.status).toBe('error');
  });

  it('should validate project details before generation', async () => {
    const invalidProjectDetails: GenerationState['projectDetails'] = {
      name: '',
      description: '',
      userStories: []
    };

    const generator = new RoadmapGenerator(
      { apiKey: mockApiKey },
      invalidProjectDetails,
      mockBomState
    );

    const result = await generator.generate();
    expect(result.status).toBe('error');
    expect(result.error).toBe('Project name is required');
  });
}); 