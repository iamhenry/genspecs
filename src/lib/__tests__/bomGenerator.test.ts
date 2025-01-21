import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBom, getOpenRouterClient } from '../llm';
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

describe('BOM Generator', () => {
  const mockApiKey = 'test_key';
  const mockProjectDetails: GenerationState['projectDetails'] = {
    name: 'Test Project',
    description: 'A test project using Next.js and TypeScript with Tailwind CSS',
    userStories: [
      'As a user, I want to create projects',
      'As a user, I want to manage specifications'
    ],
  };

  const mockBomContent = `#### Bill of Materials

1. Components
   1. Core Features
      - Project creation functionality
      - Specification management system
   2. Supporting Features
      - User interface components
      - Form validation

2. Technical Stack
   1. Frontend
      - Next.js
      - TypeScript
      - Tailwind CSS
   2. Backend
      - API Routes
   3. Utilities
      - Form validation libraries

3. Dependencies
   1. Core Libraries
      - React
      - Next.js
   2. Third-party Dependencies
      - Tailwind CSS
      - TypeScript

4. Functional Requirements
   1. MVP Core Functionalities
      - Project creation
      - Specification management`;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: mockBomContent } }]
    } as ChatCompletion);
  });

  it('should generate BOM when README generation is successful', async () => {
    const readmeState = { type: 'readme', status: 'accepted', content: 'mock readme' };
    const result = await generateBom(mockProjectDetails, readmeState, mockApiKey);

    expect(result).toBeDefined();
    expect(result.content).toBe(mockBomContent);
    expect(result.status).toBe('accepted');
    expect(result.type).toBe('bom');
  });

  it('should not generate BOM when README generation has failed', async () => {
    const readmeState = { type: 'readme', status: 'error', content: '', error: 'README failed' };
    
    await expect(generateBom(mockProjectDetails, readmeState, mockApiKey)).rejects.toThrow(
      'Cannot generate BOM: README generation has not completed successfully'
    );
  });

  it('should handle API errors gracefully', async () => {
    const readmeState = { type: 'readme', status: 'accepted', content: 'mock readme' };
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const result = await generateBom(mockProjectDetails, readmeState, mockApiKey);

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API Error');
  });

  it('should maintain existing document state on error', async () => {
    const readmeState = { type: 'readme', status: 'accepted', content: 'mock readme' };
    const mockOpenAI = getOpenRouterClient({ apiKey: mockApiKey });
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));

    const existingContent = '#### Existing BOM';
    const result = await generateBom(mockProjectDetails, readmeState, mockApiKey, existingContent);

    expect(result.content).toBe(existingContent);
    expect(result.status).toBe('error');
  });
});