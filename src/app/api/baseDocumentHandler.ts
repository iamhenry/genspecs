import { NextResponse } from 'next/server';
import { DocumentType } from '@/types/generation';
import { GeneratorDependency } from '@/lib/generators/BaseDocumentGenerator';
import OpenAI from 'openai';

export interface DocumentGenerationConfig {
  type: DocumentType;
  systemPrompt: string;
  userPrompt: string;
  dependencies?: GeneratorDependency[];
  apiKey: string;
  signal?: AbortSignal;
}

export async function handleDocumentGeneration(
  config: DocumentGenerationConfig
): Promise<NextResponse> {
  try {
    const { dependencies = [], apiKey } = config;

    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate dependencies
    if (dependencies.length > 0) {
      for (const dep of dependencies) {
        if (dep.state.status !== dep.requiredStatus) {
          return NextResponse.json(
            { error: dep.errorMessage },
            { status: 400 }
          );
        }
      }
    }

    // Initialize OpenRouter client
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://genspecs.vercel.app",
        "X-Title": "GenSpecs",
      },
    });

    // Generate content
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: config.userPrompt }
      ],
      model: "anthropic/claude-3.5-sonnet:beta",
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({
      type: config.type,
      content: response.choices[0]?.message?.content || '',
      status: 'accepted',
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error(`Failed to generate ${config.type}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : `Failed to generate ${config.type}` },
      { status: 500 }
    );
  }
} 