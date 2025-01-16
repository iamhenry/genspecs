export type DocumentType = 'bom' | 'roadmap' | 'implementation-plan';

export type DocumentStatus = 'idle' | 'generating' | 'draft' | 'accepted' | 'error';

export interface DocumentState {
  type: DocumentType;
  content: string;
  status: DocumentStatus;
  error?: string;
  lastUpdated?: Date;
}

export interface StepState {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  documentType: DocumentType;
}

export interface GenerationState {
  currentStep: string;
  projectDetails: {
    name: string;
    description: string;
    techStack: string[];
    userStories: string[];
  };
  documents: Record<DocumentType, DocumentState>;
  steps: StepState[];
} 