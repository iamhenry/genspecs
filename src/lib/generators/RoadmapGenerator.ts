import { DocumentState, DocumentStatus, DocumentType, GenerationState } from '@/types/generation';
import { BaseDocumentGenerator, GeneratorConfig } from './BaseDocumentGenerator';

// Export the system prompt generator for reuse
export const generateRoadmapSystemPrompt = (): string => {
  return `# Instructions

- Review and analyze the Required documents
- Then decompose and suggest a step by step plan to development
- Break down complex tasks into subtasks (scale of 1-5, 5 being very complex)
- Ensure the plan is outlined in Milestones
- Phases: Static UI (UI scaffold, no functionality yet) -> Frontend -> Backend -> UI Polish
- Only output the roadmap in markdown format and omit everything else

<output_format>
## Phase 1: Static UI Implementation (Complexity: 2)

### Milestone 1.1: Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS and Shadcn UI
- [ ] Set up project structure and routing
- [ ] Implement base layout components

### Milestone 1.2: Initial Form UI
- [ ] Create project initialization form components
  - [ ] Project name input
  - [ ] Project description input
  - [ ] Tech stack selection
</output_format>

`;

};

export class RoadmapGenerator extends BaseDocumentGenerator {
  protected get documentType(): DocumentType {
    return 'roadmap';
  }

  protected validateProjectDetails(): void {
    if (!this.projectDetails.name) {
      throw new Error('Project name is required');
    }
    if (!this.projectDetails.description) {
      throw new Error('Project description is required');
    }
    if (!this.projectDetails.userStories || this.projectDetails.userStories.length === 0) {
      throw new Error('At least one user story is required');
    }
  }

  protected generateSystemPrompt(): string {
    return generateRoadmapSystemPrompt();
  }

  protected generateUserPrompt(): string {
    const bomState = this.dependencies[0].state;
    
    // Process BOM content in chunks
    const maxBomLength = 5000;
    const bomContent = bomState.content.length > maxBomLength
      ? `${bomState.content.substring(0, maxBomLength)}... [truncated]`
      : bomState.content;

    return `Please generate a Project Roadmap for my project with these details:

Project Name: ${this.projectDetails.name}
Description: ${this.projectDetails.description}
User Stories:
${this.projectDetails.userStories.map(story => `- ${story}`).join('\n')}

Key BOM Components:
${bomContent}

Generate the Roadmap following the structure exactly as specified in the system prompt.
Focus on the most critical components and phase transitions.
If BOM content was truncated, prioritize the most important elements.`;
  }

  constructor(
    config: GeneratorConfig,
    projectDetails: GenerationState['projectDetails'],
    bomState: DocumentState
  ) {
    const dependencies = [{
      state: bomState,
      requiredStatus: 'accepted' as DocumentStatus,
      errorMessage: 'BOM generation not completed'
    }];

    super(config, projectDetails, dependencies);
  }
}
