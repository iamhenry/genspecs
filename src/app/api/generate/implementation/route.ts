import { handleDocumentGeneration } from '../../baseDocumentHandler';
import { generateImplementationPlanSystemPrompt } from '@/lib/generators/ImplementationPlanGenerator';
import { DocumentState, GenerationState } from '@/types/generation';

export async function POST(request: Request) {
  const { projectDetails, roadmapState, apiKey }: {
    projectDetails: GenerationState['projectDetails'],
    roadmapState: DocumentState,
    apiKey: string
  } = await request.json();

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
} 