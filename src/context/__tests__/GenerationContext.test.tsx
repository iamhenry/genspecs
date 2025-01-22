/**
 * @fileoverview Test suite for the Generation Context provider and hooks.
 * Tests the state management, document generation workflow, and integration
 * with the API key context. Includes tests for persistence, error handling,
 * and step management.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { GenerationProvider, useGeneration } from "../GenerationContext";
import { ApiKeyProvider, useApiKey } from "../ApiKeyContext";
import { generateReadme, generateBom } from "@/lib/llm";

// Mock the llm functions
vi.mock("@/lib/llm", () => ({
  generateReadme: vi.fn(),
  generateBom: vi.fn(),
}));

// Mock ApiKeyContext
const mockUseApiKey = vi.fn().mockReturnValue({
  apiKey: "test-api-key",
  isValid: true,
  setApiKey: vi.fn(),
  validateApiKey: vi.fn(),
  clearApiKey: vi.fn(),
});

vi.mock("@/context/ApiKeyContext", () => ({
  ApiKeyProvider: ({ children }: { children: React.ReactNode }) => children,
  useApiKey: () => mockUseApiKey(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Mock encryption functions
vi.mock("@/lib/encryption", () => ({
  encrypt: vi.fn().mockResolvedValue("encrypted_key"),
  decrypt: vi.fn().mockResolvedValue("test_api_key"),
}));

describe("GenerationContext", () => {
  // Wrapper component for testing hooks
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ApiKeyProvider>
      <GenerationProvider>{children}</GenerationProvider>
    </ApiKeyProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.removeItem.mockImplementation(() => {});

    // Set up default mock responses
    vi.mocked(generateReadme).mockResolvedValue({
      type: "readme",
      content: "Generated README",
      status: "draft",
    });

    vi.mocked(generateBom).mockResolvedValue({
      type: "bom",
      content: "Generated BOM",
      status: "draft",
    });
  });

  describe("Initial State", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      expect(result.current.currentStep).toBe("");
      expect(result.current.projectDetails).toEqual({
        name: "",
        description: "",
        userStories: [],
      });
      expect(result.current.documents.readme.status).toBe("idle");
      expect(result.current.documents.bom.status).toBe("idle");
      expect(result.current.documents.roadmap.status).toBe("idle");
      expect(result.current.documents.implementation.status).toBe("idle");
    });

    it("should load state from localStorage if available (old format)", () => {
      // Test with old state format (only readme and bom)
      const oldSavedState = {
        currentStep: "readme",
        projectDetails: { name: "Test Project" },
        documents: {
          readme: {
            type: "readme",
            content: "Saved README",
            status: "accepted",
          },
          bom: { type: "bom", content: "Saved BOM", status: "draft" },
        },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(oldSavedState));

      const { result } = renderHook(() => useGeneration(), { wrapper });

      // Verify old state is preserved
      expect(result.current.currentStep).toBe("readme");
      expect(result.current.projectDetails.name).toBe("Test Project");
      expect(result.current.documents.readme.status).toBe("accepted");
      expect(result.current.documents.bom.status).toBe("draft");

      // Verify new document types are initialized
      expect(result.current.documents.roadmap.status).toBe("idle");
      expect(result.current.documents.implementation.status).toBe("idle");
    });

    it("should load state from localStorage if available (new format)", () => {
      // Test with new state format (all document types)
      const newSavedState = {
        currentStep: "roadmap",
        projectDetails: { name: "Test Project" },
        documents: {
          readme: {
            type: "readme",
            content: "Saved README",
            status: "accepted",
          },
          bom: {
            type: "bom",
            content: "Saved BOM",
            status: "accepted",
          },
          roadmap: {
            type: "roadmap",
            content: "Saved Roadmap",
            status: "draft",
          },
          implementation: {
            type: "implementation",
            content: "",
            status: "idle",
          },
        },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(newSavedState));

      const { result } = renderHook(() => useGeneration(), { wrapper });

      // Verify all state is preserved
      expect(result.current.currentStep).toBe("roadmap");
      expect(result.current.projectDetails.name).toBe("Test Project");
      expect(result.current.documents.readme.status).toBe("accepted");
      expect(result.current.documents.bom.status).toBe("accepted");
      expect(result.current.documents.roadmap.status).toBe("draft");
      expect(result.current.documents.implementation.status).toBe("idle");
    });
  });

  describe("Step Management", () => {
    it("should update current step", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.setCurrentStep("readme");
      });

      expect(result.current.currentStep).toBe("readme");
      expect(
        result.current.steps.find((s) => s.id === "readme")?.isActive
      ).toBe(true);
    });

    it("should complete a step", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.completeStep("project-details");
      });

      expect(
        result.current.steps.find((s) => s.id === "project-details")
          ?.isCompleted
      ).toBe(true);
    });
  });

  describe("Document Management", () => {
    it("should update document state", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.updateDocument("readme", {
          content: "New content",
          status: "draft",
        });
      });

      expect(result.current.documents.readme.content).toBe("New content");
      expect(result.current.documents.readme.status).toBe("draft");
    });

    it("should accept document and complete corresponding step", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.acceptDocument("readme");
      });

      expect(result.current.documents.readme.status).toBe("accepted");
      expect(
        result.current.steps.find((s) => s.documentType === "readme")
          ?.isCompleted
      ).toBe(true);
    });

    it("should trigger document regeneration", async () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.regenerateDocument("readme");
      });

      await waitFor(() => {
        expect(result.current.documents.readme.status).toBe("generating");
      });
    });
  });

  describe("Project Details Management", () => {
    it("should update project details", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.updateProjectDetails({
          name: "Updated Project",
          description: "Updated Description",
        });
      });

      expect(result.current.projectDetails.name).toBe("Updated Project");
      expect(result.current.projectDetails.description).toBe(
        "Updated Description"
      );
    });
  });

  describe("Automatic BOM Generation", () => {
    it("should trigger BOM generation when README is accepted", async () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.acceptDocument("readme");
      });

      await waitFor(() => {
        expect(result.current.documents.bom.status).toBe("generating");
        expect(result.current.currentStep).toBe("bom");
      });
    });

    it("should not trigger BOM generation if README is not accepted", () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.updateDocument("readme", {
          status: "draft",
          content: "Draft README",
        });
      });

      expect(result.current.documents.bom.status).toBe("idle");
    });
  });

  describe("Document Generation Process", () => {
    it("should handle successful README generation", async () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      await act(async () => {
        result.current.updateDocument("readme", { status: "generating" });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.documents.readme.content).toBe("Generated README");
      expect(result.current.documents.readme.status).toBe("draft");
    });

    it("should handle README generation error", async () => {
      vi.mocked(generateReadme).mockRejectedValueOnce(
        new Error("Generation failed")
      );

      const { result } = renderHook(() => useGeneration(), { wrapper });

      await act(async () => {
        result.current.updateDocument("readme", { status: "generating" });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.documents.readme.status).toBe("error");
      expect(result.current.documents.readme.error).toBe("Generation failed");
    });

    it("should handle successful BOM generation", async () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      await act(async () => {
        result.current.updateDocument("bom", { status: "generating" });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.documents.bom.content).toBe("Generated BOM");
      expect(result.current.documents.bom.status).toBe("draft");
    });

    it("should handle BOM generation error", async () => {
      vi.mocked(generateBom).mockRejectedValueOnce(
        new Error("Generation failed")
      );

      const { result } = renderHook(() => useGeneration(), { wrapper });

      await act(async () => {
        result.current.updateDocument("bom", { status: "generating" });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.documents.bom.status).toBe("error");
      expect(result.current.documents.bom.error).toBe("Generation failed");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing API key", async () => {
      mockUseApiKey.mockReturnValue({
        apiKey: null,
        isValid: false,
        setApiKey: vi.fn(),
        validateApiKey: vi.fn(),
        clearApiKey: vi.fn(),
      });

      const { result } = renderHook(() => useGeneration(), { wrapper });

      act(() => {
        result.current.regenerateDocument("readme");
      });

      await waitFor(
        () => {
          expect(result.current.documents.readme.status).toBe("error");
          expect(result.current.documents.readme.error).toBe(
            "OpenRouter API key is required"
          );
        },
        { timeout: 2000 }
      );
    });

    it("should throw error when useGeneration is used outside provider", () => {
      expect(() => renderHook(() => useGeneration())).toThrow(
        "useGeneration must be used within a GenerationProvider"
      );
    });
  });

  describe("State Persistence", () => {
    it("should persist state changes to localStorage", async () => {
      const { result } = renderHook(() => useGeneration(), { wrapper });

      await act(async () => {
        result.current.updateProjectDetails({
          name: "Test Project",
          description: "Test Description",
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "generation_state",
        expect.any(String)
      );
      const savedState = JSON.parse(
        mockLocalStorage.setItem.mock.calls[
          mockLocalStorage.setItem.mock.calls.length - 1
        ][1]
      );
      expect(savedState.projectDetails.name).toBe("Test Project");
    });

    it("should handle localStorage parsing errors gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const { result } = renderHook(() => useGeneration(), { wrapper });

      expect(result.current.currentStep).toBe("");
      expect(result.current.projectDetails.name).toBe("");
    });
  });
});
