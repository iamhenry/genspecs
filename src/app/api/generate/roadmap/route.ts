import { handleDocumentGeneration, DocumentGenerationConfig } from '../../baseDocumentHandler';
import { generateRoadmapSystemPrompt } from '@/lib/generators/RoadmapGenerator';
import { DocumentState, GenerationState } from '@/types/generation';
import { NextResponse } from 'next/server';

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds

async function generateWithRetry(config: DocumentGenerationConfig, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INITIAL_TIMEOUT * (retryCount + 1));

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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: error instanceof Response ? error.status : undefined,
      headers: error instanceof Response ? Object.fromEntries(error.headers?.entries() || []) : undefined
    });
    
    // Handle non-JSON responses
    if (error instanceof Response) {
      try {
        const errorText = await error.text();
        return NextResponse.json(
          { error: errorText },
          { status: error.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to generate Roadmap: Server error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate Roadmap' },
      { status: 500 }
    );
  }
} 