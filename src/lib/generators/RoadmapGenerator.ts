import { DocumentState, DocumentStatus, DocumentType, GenerationState } from '@/types/generation';
import { BaseDocumentGenerator, GeneratorConfig } from './BaseDocumentGenerator';

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
    return `# Instructions

- Review and analyze the Required documents
- Then decompose and suggest a step by step plan to development
- Break down complex tasks into subtasks (scale of 1-5, 5 being very complex)
- Ensure the plan is outlined in Milestones
- Phases: Static UI (UI scaffold, no functionality yet) -> Frontend -> Backend -> UI Polish`;
  }

  protected generateUserPrompt(): string {
    const bomState = this.dependencies[0].state;
    return `Please generate a Project Roadmap for my project with these details:

Project Name: ${this.projectDetails.name}
Description: ${this.projectDetails.description}
User Stories:
${this.projectDetails.userStories.map(story => `- ${story}`).join('\n')}

BOM Content:
${bomState.content}

Generate the Roadmap following the structure exactly as specified in the system prompt.
Ensure proper sequencing of tasks and clear phase transitions.`;
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