/**
 * @fileoverview API route handler for README generation.
 * Processes project details and generates a structured README document
 * using the OpenRouter API with Claude 3.5 Sonnet. Includes error handling
 * and validation of required fields.
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GenerationState } from '@/types/generation';

export async function POST(request: Request) {
  try {
    const { projectDetails, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": request.headers.get('referer') || "",
        "X-Title": "GenSpecs",
      },
    });

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

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "anthropic/claude-3.5-sonnet:beta",
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || '',
      status: 'accepted',
      type: 'readme',
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Failed to generate README:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate README' },
      { status: 500 }
    );
  }
} 