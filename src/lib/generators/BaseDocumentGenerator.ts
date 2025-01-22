import { DocumentState, DocumentStatus, DocumentType, GenerationState } from '@/types/generation';
import { getOpenRouterClient } from '../llm';

export interface GeneratorConfig {
  apiKey: string;
  siteName?: string;
  maxRetries?: number;
}

export interface GeneratorDependency {
  state: DocumentState;
  requiredStatus: DocumentStatus;
  errorMessage: string;
}

export abstract class BaseDocumentGenerator {
  protected config: GeneratorConfig;
  protected projectDetails: GenerationState['projectDetails'];
  protected dependencies: GeneratorDependency[];

  constructor(
    config: GeneratorConfig,
    projectDetails: GenerationState['projectDetails'],
    dependencies: GeneratorDependency[] = []
  ) {
    this.config = config;
    this.projectDetails = projectDetails;
    this.dependencies = dependencies;
  }

  protected abstract get documentType(): DocumentType;
  protected abstract generateSystemPrompt(): string;
  protected abstract generateUserPrompt(): string;
  protected abstract validateProjectDetails(): void;

  protected validateDependencies(): void {
    for (const dep of this.dependencies) {
      if (dep.state.status !== dep.requiredStatus) {
        console.error(`${this.documentType} generation failed: ${dep.errorMessage}`);
        throw new Error(dep.errorMessage);
      }
    }
  }

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      console.error(`${this.documentType} generation failed: API key is required`);
      throw new Error('OpenRouter API key is required');
    }
  }

  public async generate(existingContent?: string): Promise<DocumentState> {
    console.log(`Starting ${this.documentType} generation with:`, {
      name: this.projectDetails.name,
      description: this.projectDetails.description,
      userStoriesCount: this.projectDetails.userStories.length,
      dependencies: this.dependencies.map(d => ({ type: d.state.type, status: d.state.status }))
    });

    try {
      this.validateConfig();
      this.validateProjectDetails();
      this.validateDependencies();

      if (process.env.NODE_ENV === 'development') {
        return await this.generateWithOpenRouter(existingContent);
      } else {
        return await this.generateWithApi(existingContent);
      }
    } catch (error) {
      return this.handleError(error, existingContent);
    }
  }

  protected async generateWithOpenRouter(existingContent?: string): Promise<DocumentState> {
    console.log('Using API key:', this.config.apiKey ? 'Present' : 'Missing');
    const client = getOpenRouterClient(this.config);
    console.log('Making OpenRouter API call with Claude 3.5 Sonnet...');

    const systemPrompt = this.generateSystemPrompt();
    const userPrompt = this.generateUserPrompt();

    console.log('Sending request with prompts:', { systemPrompt, userPrompt });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "anthropic/claude-3.5-sonnet:beta",
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('Received response:', response);
    const content = response.choices[0]?.message?.content || '';
    console.log(`Generated ${this.documentType} content:`, content);

    return {
      type: this.documentType,
      content,
      status: 'accepted' as DocumentStatus,
      lastUpdated: new Date(),
    };
  }

  protected async generateWithApi(existingContent?: string): Promise<DocumentState> {
    const response = await fetch(`/api/generate/${this.documentType.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectDetails: this.projectDetails,
        dependencies: this.dependencies,
        apiKey: this.config.apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to generate ${this.documentType}`);
    }

    return await response.json();
  }

  protected handleError(error: unknown, existingContent?: string): DocumentState {
    console.error(`Failed to generate ${this.documentType}. Full error:`, error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      type: this.documentType,
      content: existingContent || '',
      status: 'error',
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 