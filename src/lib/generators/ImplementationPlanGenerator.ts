import { DocumentState, DocumentStatus, DocumentType, GenerationState } from '@/types/generation';
import { BaseDocumentGenerator, GeneratorConfig } from './BaseDocumentGenerator';

// Export the system prompt generator for reuse
export const generateImplementationPlanSystemPrompt = (): string => {
  return `# Instructions

Create a detailed task plan for developing a software feature, ensuring the following structure:

1. Divide the feature into milestones (Ensure to follow the "Phases" outlined in "roadmap.md")
   - Each milestone should represent a significant deliverable or phase of the project.
   - Include a clear objective describing the goal of the milestone and acceptance criteria defining what qualifies the milestone as complete.
2. Break down each milestone into tasks
   - Each task should be tightly scoped, actionable, small, and independent.
   - Decompose and draft a step by step plan to development.
   - Decompose complex tasks (complexity > 2 on a 1-5 scale) into subtasks
   - Clear technical scope
   - Specific and descriptive implementation details (without being too verbose)
   - Integration points with existing code
   - Concrete deliverables
   - Technology choices
3. Specify dependencies
   Identify and document relationships between tasks, indicating which tasks depend on others.
4. Include file references
   For each task, specify which file(s) to modify, and note if a file needs to be created.
5. Format the tasks as markdown checkboxes
   Use markdown formatting to ensure tasks are easy to track and check off.`;
};

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
    return generateImplementationPlanSystemPrompt();
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