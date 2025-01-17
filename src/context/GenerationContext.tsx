/**
 * @fileoverview Context provider for managing the state of document generation workflow.
 * Handles the multi-step process of generating and managing various project documents.
 *
 * @module GenerationContext
 * @requires React
 * @requires generation types
 *
 * Features:
 * - Step-by-step workflow management
 * - Document state management (BOM, Roadmap, Implementation Plan)
 * - Project details persistence
 * - State persistence in localStorage
 * - Type-safe context with TypeScript
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DocumentType,
  GenerationState,
  DocumentState,
} from "@/types/generation";

interface GenerationContextType extends GenerationState {
  // Step Actions
  setCurrentStep: (stepId: string) => void;
  completeStep: (stepId: string) => void;

  // Document Actions
  updateDocument: (type: DocumentType, updates: Partial<DocumentState>) => void;
  acceptDocument: (type: DocumentType) => void;
  regenerateDocument: (type: DocumentType) => void;

  // Project Actions
  updateProjectDetails: (
    updates: Partial<GenerationState["projectDetails"]>
  ) => void;
}

const STORAGE_KEY = "generation_state";

const initialState: GenerationState = {
  currentStep: "",
  projectDetails: {
    name: "",
    description: "",
    techStack: [],
    userStories: [],
  },
  documents: {
    bom: { type: "bom", content: "", status: "idle" },
    roadmap: { type: "roadmap", content: "", status: "idle" },
    "implementation-plan": {
      type: "implementation-plan",
      content: "",
      status: "idle",
    },
  },
  steps: [
    {
      id: "project-details",
      title: "Project Details",
      description: "Enter project information",
      isCompleted: false,
      isActive: true,
      documentType: "bom",
    },
    {
      id: "bom",
      title: "Bill of Materials",
      description: "Generate and review BOM",
      isCompleted: false,
      isActive: false,
      documentType: "bom",
    },
    {
      id: "roadmap",
      title: "Roadmap",
      description: "Generate and review roadmap",
      isCompleted: false,
      isActive: false,
      documentType: "roadmap",
    },
    {
      id: "implementation-plan",
      title: "Implementation Plan",
      description: "Generate and review implementation plan",
      isCompleted: false,
      isActive: false,
      documentType: "implementation-plan",
    },
  ],
};

const GenerationContext = createContext<GenerationContextType | undefined>(
  undefined
);

export function GenerationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GenerationState>(initialState);

  useEffect(() => {
    // Load state from localStorage on mount
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (error) {
        console.error("Failed to parse saved generation state:", error);
      }
    }
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrentStep = (stepId: string) => {
    setState((prev) => ({
      ...prev,
      currentStep: stepId,
      steps: prev.steps.map((step) => ({
        ...step,
        isActive: step.id === stepId,
      })),
    }));
  };

  const completeStep = (stepId: string) => {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => ({
        ...step,
        isCompleted: step.id === stepId ? true : step.isCompleted,
      })),
    }));
  };

  const updateDocument = (
    type: DocumentType,
    updates: Partial<DocumentState>
  ) => {
    setState((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: {
          ...prev.documents[type],
          ...updates,
          lastUpdated: new Date(),
        },
      },
    }));
  };

  const acceptDocument = (type: DocumentType) => {
    updateDocument(type, { status: "accepted" });
    const currentStep = state.steps.find((step) => step.documentType === type);
    if (currentStep) {
      completeStep(currentStep.id);
    }
  };

  const regenerateDocument = (type: DocumentType) => {
    updateDocument(type, { status: "generating" });
  };

  const updateProjectDetails = (
    updates: Partial<GenerationState["projectDetails"]>
  ) => {
    setState((prev) => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails,
        ...updates,
      },
    }));
  };

  return (
    <GenerationContext.Provider
      value={{
        ...state,
        setCurrentStep,
        completeStep,
        updateDocument,
        acceptDocument,
        regenerateDocument,
        updateProjectDetails,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error("useGeneration must be used within a GenerationProvider");
  }
  return context;
}
