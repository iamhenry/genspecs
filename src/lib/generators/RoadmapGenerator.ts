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
    return `You are a technical project planning expert. Generate a project roadmap following this exact structure:

# Project Roadmap

## Phase 1: Foundation
[Initial setup and core infrastructure tasks]

## Phase 2: Core Features
[Essential features and functionality]

## Phase 3: Advanced Features
[Additional features and enhancements]

## Phase 4: Polish & Launch
[Final improvements and launch preparation]

Extract information from the project details and BOM to create a comprehensive roadmap. Focus on logical progression and dependencies between phases.`;
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