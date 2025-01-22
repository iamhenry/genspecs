/**
 * @fileoverview Type definitions for the document generation system.
 * Contains all type interfaces used in the generation workflow.
 * 
 * @module generation-types
 * 
 * Types defined:
 * - DocumentType: Types of documents that can be generated
 * - DocumentStatus: Possible states of a document
 * - DocumentState: Complete state of a document
 * - StepState: State of a generation workflow step
 * - GenerationState: Complete state of the generation system
 */

export type DocumentType = 'readme' | 'bom' | 'roadmap' | 'implementation';

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
    userStories: string[];
  };
  documents: Record<DocumentType, DocumentState>;
  steps: StepState[];
} 