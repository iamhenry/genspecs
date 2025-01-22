import { DocumentState, DocumentStatus, DocumentType, GenerationState } from '@/types/generation';
import { BaseDocumentGenerator, GeneratorConfig } from './BaseDocumentGenerator';

export class ImplementationPlanGenerator extends BaseDocumentGenerator {
  protected get documentType(): DocumentType {
    return 'implementation';
  }

  protected validateProjectDetails(): void {
    if (!this.projectDetails.name) {
      throw new Error('Project name is required');
    }
    if (!this.projectDetails.description) {
      throw new Error('Project description is required');
    }
  }

  protected generateSystemPrompt(): string {
    return `You are a technical implementation planning expert. Generate a detailed implementation plan following this exact structure:

# Implementation Plan

## Phase Details

### Phase 1: [Phase Name]
1. [Task Group]
   - Detailed task description
   - Technical requirements
   - Dependencies
   - Estimated effort

[Repeat for each phase from the roadmap]

Extract information from the project details and roadmap to create a comprehensive implementation plan.
Focus on technical details, dependencies, and concrete implementation steps.`;
  }

  protected generateUserPrompt(): string {
    const roadmapState = this.dependencies[0].state;
    return `Please generate an Implementation Plan for my project with these details:

Project Name: ${this.projectDetails.name}
Description: ${this.projectDetails.description}
User Stories:
${this.projectDetails.userStories.map(story => `- ${story}`).join('\n')}

Roadmap Content:
${roadmapState.content}

Generate the Implementation Plan following the structure exactly as specified in the system prompt.
Break down each roadmap phase into detailed, actionable implementation tasks.`;
  }

  constructor(
    config: GeneratorConfig,
    projectDetails: GenerationState['projectDetails'],
    roadmapState: DocumentState
  ) {
    const dependencies = [{
      state: roadmapState,
      requiredStatus: 'accepted' as DocumentStatus,
      errorMessage: 'Cannot generate Implementation Plan: Roadmap generation has not completed successfully'
    }];

    super(config, projectDetails, dependencies);
  }
} 