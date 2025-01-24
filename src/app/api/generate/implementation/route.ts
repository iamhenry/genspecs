import { handleDocumentGeneration, DocumentGenerationConfig } from '../../baseDocumentHandler';
import { generateImplementationPlanSystemPrompt } from '@/lib/generators/ImplementationPlanGenerator';
import { DocumentState, GenerationState } from '@/types/generation';
import { NextResponse } from 'next/server';
import { DocumentType } from '@/types/generation';

// Add Edge runtime configuration
export const runtime = 'edge';

const MAX_RETRIES = 2;
const INITIAL_TIMEOUT = 25000; // 25 seconds

async function generateWithRetry(config: DocumentGenerationConfig, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INITIAL_TIMEOUT);

    const response = await handleDocumentGeneration({
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error);

    // Only retry on timeout errors
    if (retryCount < MAX_RETRIES && error instanceof Error && error.name === 'AbortError') {
      // Add exponential backoff
      const backoffTime = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying in ${backoffTime}ms... Attempt ${retryCount + 2} of ${MAX_RETRIES + 1}`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return generateWithRetry(config, retryCount + 1);
    }

    // For other errors, return a meaningful response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate Implementation Plan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('Starting Implementation Plan generation API route...');
  
  try {
    // Clone the request to allow multiple reads
    const clonedRequest = request.clone();
    
    console.log('Parsing request body...');
    const { projectDetails, roadmapState, apiKey }: {
      projectDetails: GenerationState['projectDetails'],
      roadmapState: DocumentState,
      apiKey: string
    } = await clonedRequest.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    console.log('Request parsed successfully', {
      projectName: projectDetails.name,
      userStoriesCount: projectDetails.userStories?.length,
      roadmapStatus: roadmapState?.status,
      hasApiKey: !!apiKey
    });

    const config: DocumentGenerationConfig = {
      type: 'implementation' as DocumentType,
      systemPrompt: generateImplementationPlanSystemPrompt(),
      userPrompt: `Please generate an Implementation Plan for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map((story: string) => `- ${story}`).join('\n')}

Roadmap Content:
${roadmapState.content}

Generate the Implementation Plan following the structure exactly as specified in the system prompt.
Break down each roadmap phase into detailed, actionable implementation tasks.`,
      dependencies: [{
        state: roadmapState,
        requiredStatus: 'accepted',
        errorMessage: 'Cannot generate Implementation Plan: Roadmap generation has not completed successfully'
      }],
      apiKey
    };

    return await generateWithRetry(config);
  } catch (error) {
    console.error('Failed to generate Implementation Plan. Full error:', error);
    
    // Ensure we always return a proper JSON response
    let errorMessage = 'Failed to generate Implementation Plan';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof Response) {
      statusCode = error.status;
      try {
        const errorData = await error.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        try {
          errorMessage = await error.text();
        } catch {
          errorMessage = 'Failed to generate Implementation Plan: Server error';
        }
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 