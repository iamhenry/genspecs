/**
 * @fileoverview API route handler for Bill of Materials (BOM) generation.
 * Processes project details and README state to generate a structured BOM document
 * using the OpenRouter API with Claude 3.5 Sonnet. Includes comprehensive error
 * handling, logging, and validation of prerequisites.
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DocumentState } from '@/types/generation';

export async function POST(request: Request) {
  console.log('Starting BOM generation API route...');
  
  try {
    const { projectDetails, readmeState, apiKey } = await request.json() as {
      projectDetails: { name: string; description: string; userStories: string[] };
      readmeState: DocumentState;
      apiKey: string;
    };

    console.log('BOM Generation Request:', {
      projectName: projectDetails.name,
      userStoriesCount: projectDetails.userStories.length,
      readmeStatus: readmeState?.status,
      hasApiKey: !!apiKey
    });

    if (!apiKey) {
      console.error('BOM generation failed: API key is missing');
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate README state
    if (!readmeState || readmeState.status !== 'accepted') {
      console.error('BOM generation failed: Invalid README state', {
        readmeStatus: readmeState?.status
      });
      return NextResponse.json(
        { error: 'Cannot generate BOM: README generation has not completed successfully' },
        { status: 400 }
      );
    }

    console.log('Initializing OpenRouter client for BOM generation...');
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": request.headers.get('referer') || "",
        "X-Title": "GenSpecs",
      },
    });

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
${projectDetails.userStories.map((story: string) => `- ${story}`).join('\n')}

Generate the BOM following the structure exactly as specified in the system prompt.
Analyze the project details to identify and categorize all technical components, dependencies, and requirements.`;

    console.log('Making OpenRouter API call for BOM generation...', {
      model: "anthropic/claude-3.5-sonnet:beta",
      maxTokens: 2000
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "anthropic/claude-3.5-sonnet:beta",
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('BOM generation completed successfully', {
      contentLength: response.choices[0]?.message?.content?.length || 0,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || '',
      status: 'accepted',
      type: 'bom',
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Failed to generate BOM. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate BOM' },
      { status: 500 }
    );
  }
} 