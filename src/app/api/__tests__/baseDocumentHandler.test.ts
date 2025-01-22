/**
 * @fileoverview Test suite for the base document generation API handler.
 * Tests the generic document generation functionality using the OpenRouter API,
 * including validation, error handling, and dependency management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { handleDocumentGeneration } from '@/app/api/baseDocumentHandler';
import { DocumentType } from '@/types/generation';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn()
  };
});

describe('Base Document Generation Handler', () => {
  const mockApiKey = 'test-api-key';
  const mockSystemPrompt = 'You are a technical writer.';
  const mockUserPrompt = 'Generate documentation for this project.';
  const mockProjectDetails = {
    name: 'Test Project',
    description: 'A test project',
    userStories: ['Story 1', 'Story 2']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate API key', async () => {
    const request = new Request('http://localhost:3000/api/generate/test', {
      method: 'POST',
      body: JSON.stringify({
        projectDetails: mockProjectDetails,
        dependencies: []
      })
    });

    const response = await handleDocumentGeneration(request, {
      type: 'readme' as DocumentType,
      systemPrompt: mockSystemPrompt,
      userPrompt: mockUserPrompt
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('API key is required');
  });

  it('should validate dependencies', async () => {
    const mockDependencies = [{
      state: { type: 'bom', status: 'error', content: '' },
      requiredStatus: 'accepted',
      errorMessage: 'BOM generation not completed'
    }];

    const request = new Request('http://localhost:3000/api/generate/test', {
      method: 'POST',
      body: JSON.stringify({
        projectDetails: mockProjectDetails,
        dependencies: mockDependencies,
        apiKey: mockApiKey
      })
    });

    const response = await handleDocumentGeneration(request, {
      type: 'roadmap' as DocumentType,
      systemPrompt: mockSystemPrompt,
      userPrompt: mockUserPrompt
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('BOM generation not completed');
  });

  it('should handle successful generation', async () => {
    const mockContent = '# Generated Content';
    const mockResponse = {
      id: 'test-id',
      created: Date.now(),
      model: 'anthropic/claude-3.5-sonnet:beta',
      object: 'chat.completion',
      choices: [{
        message: { 
          role: 'assistant',
          content: mockContent,
          tool_calls: undefined,
          function_call: undefined,
          name: undefined,
          refusal: null
        },
        finish_reason: 'stop',
        index: 0,
        logprobs: null
      }],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 100,
        total_tokens: 200
      }
    };

    const mockCreate = vi.fn().mockResolvedValueOnce(mockResponse);
    vi.mocked(OpenAI).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate
          }
        }
      } as unknown as OpenAI;
    });

    const request = new Request('http://localhost:3000/api/generate/test', {
      method: 'POST',
      body: JSON.stringify({
        projectDetails: mockProjectDetails,
        dependencies: [],
        apiKey: mockApiKey
      })
    });

    const response = await handleDocumentGeneration(request, {
      type: 'readme' as DocumentType,
      systemPrompt: mockSystemPrompt,
      userPrompt: mockUserPrompt
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      type: 'readme',
      content: mockContent,
      status: 'accepted'
    });
    expect(Date.parse(data.lastUpdated)).not.toBeNaN();
  });

  it('should handle API errors', async () => {
    const mockCreate = vi.fn().mockRejectedValueOnce(new Error('API Error'));
    vi.mocked(OpenAI).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate
          }
        }
      } as unknown as OpenAI;
    });

    const request = new Request('http://localhost:3000/api/generate/test', {
      method: 'POST',
      body: JSON.stringify({
        projectDetails: mockProjectDetails,
        dependencies: [],
        apiKey: mockApiKey
      })
    });

    const response = await handleDocumentGeneration(request, {
      type: 'readme' as DocumentType,
      systemPrompt: mockSystemPrompt,
      userPrompt: mockUserPrompt
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('API Error');
  });
}); 