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
import {
  generateReadme,
  generateBom,
  generateRoadmap,
  generateImplementationPlan,
} from "@/lib/llm";
import { useApiKey } from "./ApiKeyContext";

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
    userStories: [],
  },
  documents: {
    readme: { type: "readme", content: "", status: "idle" },
    bom: { type: "bom", content: "", status: "idle" },
    roadmap: { type: "roadmap", content: "", status: "idle" },
    implementation: { type: "implementation", content: "", status: "idle" },
  },
  steps: [
    {
      id: "project-details",
      title: "Project Details",
      description: "Enter project information",
      isCompleted: false,
      isActive: true,
      documentType: "readme",
    },
    {
      id: "readme",
      title: "README",
      description: "Generate and review README",
      isCompleted: false,
      isActive: false,
      documentType: "readme",
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
      description: "Generate and review Roadmap",
      isCompleted: false,
      isActive: false,
      documentType: "roadmap",
    },
    {
      id: "implementation",
      title: "Implementation Plan",
      description: "Generate and review Implementation Plan",
      isCompleted: false,
      isActive: false,
      documentType: "implementation",
    },
  ],
};

const GenerationContext = createContext<GenerationContextType | undefined>(
  undefined
);

/**
 * Merges saved state with initial state to ensure backward compatibility
 * when new features are added to the state structure.
 */
function mergeWithInitialState(
  savedState: Partial<GenerationState>
): GenerationState {
  return {
    ...initialState,
    ...savedState,
    documents: {
      ...initialState.documents,
      ...(savedState.documents || {}),
    },
    steps: initialState.steps.map((step) => ({
      ...step,
      isCompleted:
        savedState.steps?.find((s) => s.id === step.id)?.isCompleted || false,
      isActive:
        savedState.steps?.find((s) => s.id === step.id)?.isActive || false,
    })),
  };
}

export function GenerationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GenerationState>(initialState);
  const { apiKey } = useApiKey();

  // Watch for document status changes and trigger generation
  useEffect(() => {
    const generateDocuments = async () => {
      // Handle README Generation
      const readmeDoc = state.documents.readme;
      if (readmeDoc.status === "generating") {
        console.log("Starting README generation from context...");
        if (!apiKey) {
          console.error("Cannot generate README: No API key provided");
          updateDocument("readme", {
            status: "error",
            error: "OpenRouter API key is required",
          });
          return;
        }
        try {
          const result = await generateReadme(
            state.projectDetails,
            undefined,
            apiKey
          );
          console.log("README Generation Result:", result);
          updateDocument("readme", {
            content: result.content,
            status: result.status,
            error: result.error,
          });
        } catch (error) {
          console.error("Failed to generate README from context:", error);
          updateDocument("readme", {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Handle BOM Generation
      const bomDoc = state.documents.bom;
      if (bomDoc.status === "generating") {
        console.log("Starting BOM generation from context...");
        if (!apiKey) {
          console.error("Cannot generate BOM: No API key provided");
          updateDocument("bom", {
            status: "error",
            error: "OpenRouter API key is required",
          });
          return;
        }
        try {
          const result = await generateBom(
            state.projectDetails,
            readmeDoc,
            apiKey
          );
          console.log("BOM Generation Result:", result);
          updateDocument("bom", {
            content: result.content,
            status: result.status,
            error: result.error,
          });
        } catch (error) {
          console.error("Failed to generate BOM from context:", error);
          updateDocument("bom", {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Handle Roadmap Generation
      const roadmapDoc = state.documents.roadmap;
      if (roadmapDoc.status === "generating") {
        console.log("Starting Roadmap generation from context...");
        if (!apiKey) {
          console.error("Cannot generate Roadmap: No API key provided");
          updateDocument("roadmap", {
            status: "error",
            error: "OpenRouter API key is required",
          });
          return;
        }
        try {
          const result = await generateRoadmap(
            state.projectDetails,
            bomDoc,
            apiKey
          );
          console.log("Roadmap Generation Result:", result);
          updateDocument("roadmap", {
            content: result.content,
            status: result.status,
            error: result.error,
          });
        } catch (error) {
          console.error("Failed to generate Roadmap from context:", error);
          updateDocument("roadmap", {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Handle Implementation Plan Generation
      const implementationDoc = state.documents.implementation;
      if (implementationDoc.status === "generating") {
        console.log("Starting Implementation Plan generation from context...");
        if (!apiKey) {
          console.error(
            "Cannot generate Implementation Plan: No API key provided"
          );
          updateDocument("implementation", {
            status: "error",
            error: "OpenRouter API key is required",
          });
          return;
        }
        try {
          const result = await generateImplementationPlan(
            state.projectDetails,
            roadmapDoc,
            apiKey
          );
          console.log("Implementation Plan Generation Result:", result);
          updateDocument("implementation", {
            content: result.content,
            status: result.status,
            error: result.error,
          });
        } catch (error) {
          console.error(
            "Failed to generate Implementation Plan from context:",
            error
          );
          updateDocument("implementation", {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    };

    generateDocuments();
  }, [
    state.documents.readme.status,
    state.documents.bom.status,
    state.documents.roadmap.status,
    state.documents.implementation.status,
    apiKey,
  ]);

  // Watch for document acceptance to trigger next generation
  useEffect(() => {
    const readmeDoc = state.documents.readme;
    const bomDoc = state.documents.bom;
    const roadmapDoc = state.documents.roadmap;

    if (readmeDoc.status === "accepted" && bomDoc.status === "idle") {
      console.log("README accepted, automatically starting BOM generation...");
      updateDocument("bom", { status: "generating" });
      setCurrentStep("bom");
    }

    if (bomDoc.status === "accepted" && roadmapDoc.status === "idle") {
      console.log("BOM accepted, automatically starting Roadmap generation...");
      updateDocument("roadmap", { status: "generating" });
      setCurrentStep("roadmap");
    }

    if (
      roadmapDoc.status === "accepted" &&
      state.documents.implementation.status === "idle"
    ) {
      console.log(
        "Roadmap accepted, automatically starting Implementation Plan generation..."
      );
      updateDocument("implementation", { status: "generating" });
      setCurrentStep("implementation");
    }
  }, [
    state.documents.readme.status,
    state.documents.bom.status,
    state.documents.roadmap.status,
  ]);

  useEffect(() => {
    // Load state from localStorage on mount
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(mergeWithInitialState(parsed));
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
