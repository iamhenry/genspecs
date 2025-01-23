import { handleDocumentGeneration } from '../../baseDocumentHandler';
import { generateImplementationPlanSystemPrompt } from '@/lib/generators/ImplementationPlanGenerator';
import { DocumentState, GenerationState } from '@/types/generation';
import { NextResponse } from 'next/server';

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

    console.log('Request parsed successfully', {
      projectName: projectDetails.name,
      userStoriesCount: projectDetails.userStories?.length,
      roadmapStatus: roadmapState?.status,
      hasApiKey: !!apiKey
    });

    return handleDocumentGeneration({
      type: 'implementation',
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
    });
  } catch (error) {
    console.error('Failed to generate Implementation Plan. Full error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      status: error instanceof Response ? error.status : undefined,
      headers: error instanceof Response ? Object.fromEntries(error.headers.entries()) : undefined
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate Implementation Plan' },
      { status: 500 }
    );
  }
} 