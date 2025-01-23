import { handleDocumentGeneration, DocumentGenerationConfig } from '../../baseDocumentHandler';
import { generateRoadmapSystemPrompt } from '@/lib/generators/RoadmapGenerator';
import { DocumentState, GenerationState } from '@/types/generation';
import { NextResponse } from 'next/server';

const MAX_RETRIES = 2;
const INITIAL_TIMEOUT = 20000; // 20 seconds

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

    if (retryCount < MAX_RETRIES && (error instanceof Error && error.name === 'AbortError' || error instanceof Response && error.status === 504)) {
      console.log(`Retrying... Attempt ${retryCount + 2} of ${MAX_RETRIES + 1}`);
      return generateWithRetry(config, retryCount + 1);
    }

    throw error;
  }
}

export async function POST(request: Request) {
  console.log('Starting Roadmap generation API route...');
  
  try {
    // Clone the request to allow multiple reads
    const clonedRequest = request.clone();
    
    console.log('Parsing request body...');
    const { projectDetails, bomState, apiKey }: { 
      projectDetails: GenerationState['projectDetails'], 
      bomState: DocumentState,
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
      bomStatus: bomState?.status,
      hasApiKey: !!apiKey
    });

    const config: DocumentGenerationConfig = {
      type: 'roadmap',
      systemPrompt: generateRoadmapSystemPrompt(),
      userPrompt: `Please generate a Project Roadmap for my project with these details:

Project Name: ${projectDetails.name}
Description: ${projectDetails.description}
User Stories:
${projectDetails.userStories.map((story: string) => `- ${story}`).join('\n')}

BOM Content:
${bomState.content}

Generate the Roadmap following the structure exactly as specified in the system prompt.
Ensure proper sequencing of tasks and clear phase transitions.`,
      dependencies: [{
        state: bomState,
        requiredStatus: 'accepted',
        errorMessage: 'Cannot generate Roadmap: BOM generation has not completed successfully'
      }],
      apiKey
    };

    return await generateWithRetry(config);
  } catch (error) {
    console.error('Failed to generate Roadmap. Full error:', error);
    
    // Ensure we always return a proper JSON response
    let errorMessage = 'Failed to generate Roadmap';
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
          errorMessage = 'Failed to generate Roadmap: Server error';
        }
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 