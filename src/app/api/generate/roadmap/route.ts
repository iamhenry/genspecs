import { handleDocumentGeneration } from '../../baseDocumentHandler';
import { generateRoadmapSystemPrompt } from '@/lib/generators/RoadmapGenerator';
import { DocumentState, GenerationState } from '@/types/generation';

export async function POST(request: Request) {
  const { projectDetails, bomState }: { 
    projectDetails: GenerationState['projectDetails'], 
    bomState: DocumentState 
  } = await request.json();
  
  return handleDocumentGeneration(request, {
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
Ensure proper sequencing of tasks and clear phase transitions.`
  });
} 