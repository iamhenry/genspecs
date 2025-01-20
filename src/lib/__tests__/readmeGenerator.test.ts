import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReadme, getOpenRouterClient } from '../llm';
import { GenerationState } from '@/types/generation';
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

describe('README Generator', () => {
  const mockApiKey = 'test_key';
  const mockProjectDetails: GenerationState['projectDetails'] = {
    name: 'Test Project',
    description: 'A test project using Next.js and TypeScript with Tailwind CSS',
    userStories: [
      'As a user, I want to create projects',
      'As a user, I want to manage specifications'
    ],
  };

  const mockReadmeContent = `# Test Project

## Overview
A test project using Next.js and TypeScript with Tailwind CSS

## Features
- Project creation
- Specification management`;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: mockReadmeContent } }]
    } as ChatCompletion);
  });

  it('should generate README when all required fields are provided', async () => {
    const result = await generateReadme(mockProjectDetails, undefined, mockApiKey);

    expect(result).toBeDefined();
    expect(result.content).toBe(mockReadmeContent);
    expect(result.status).toBe('accepted');
    expect(result.type).toBe('readme');
  });

  it('should throw error when required fields are missing', async () => {
    const invalidProjectDetails = {
      ...mockProjectDetails,
      name: '',
    };

    await expect(generateReadme(invalidProjectDetails, undefined, mockApiKey)).rejects.toThrow(
      'Project name is required'
    );
  });

  it('should handle API errors gracefully', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const result = await generateReadme(mockProjectDetails, undefined, mockApiKey);

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API Error');
  });

  it('should maintain existing document state on error', async () => {
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const existingContent = '# Existing README';
    const result = await generateReadme(mockProjectDetails, existingContent, mockApiKey);

    expect(result.content).toBe(existingContent);
    expect(result.status).toBe('error');
  });
}); 