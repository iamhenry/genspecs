import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ApiKeyProvider, useApiKey, ApiKeyContextType } from "../ApiKeyContext";
import type { ValidationResult } from "../ApiKeyContext";
import "@testing-library/jest-dom";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock encryption functions
vi.mock("@/lib/encryption", () => ({
  encrypt: vi.fn((key: string) => Promise.resolve(`encrypted_${key}`)),
  decrypt: vi.fn((key: string) =>
    Promise.resolve(key.replace("encrypted_", ""))
  ),
}));

// Test component to access context
function TestComponent({ onMount }: { onMount?: () => void }) {
  useApiKey(); // Just ensure the hook is called
  if (onMount) onMount();
  return null;
}

describe("ApiKeyContext", () => {
  let contextValue: ApiKeyContextType;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    mockFetch.mockClear();
  });

  it("should initialize with no API key", () => {
    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    expect(contextValue.apiKey).toBeNull();
    expect(contextValue.isValid).toBeFalsy();
  });

  it("should load and validate API key from localStorage on mount", async () => {
    const mockApiKey = "test_key_123";
    localStorageMock.getItem.mockReturnValue(`encrypted_${mockApiKey}`);
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ valid: true }),
      })
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    await waitFor(() => {
      expect(contextValue.apiKey).toBe(mockApiKey);
      expect(contextValue.isValid).toBeTruthy();
    });
  });

  it("should handle invalid API key validation", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      })
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    await act(async () => {
      const result = await contextValue.setApiKey("invalid_key");
      expect(result.isValid).toBeFalsy();
      expect(result.error).toContain("Invalid API key");
      expect(contextValue.isValid).toBeFalsy();
    });
  });

  it("should successfully set and validate a new API key", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ valid: true }),
      })
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    const newKey = "new_valid_key";
    let result: ValidationResult;

    await act(async () => {
      result = await contextValue.setApiKey(newKey);
    });

    expect(result.isValid).toBeTruthy();
    expect(contextValue.apiKey).toBe(newKey);
    expect(contextValue.isValid).toBeTruthy();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "openrouter_api_key",
      `encrypted_${newKey}`
    );
  });

  it("should clear API key correctly", async () => {
    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    await act(async () => {
      contextValue.clearApiKey();
    });

    expect(contextValue.apiKey).toBeNull();
    expect(contextValue.isValid).toBeFalsy();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "openrouter_api_key"
    );
  });

  it("should handle network errors during validation", async () => {
    // Set up mock to always return network error
    mockFetch.mockImplementation(() =>
      Promise.reject(new Error("Network error"))
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    // Set initial state
    await act(async () => {
      // First set a valid key
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ valid: true }),
        })
      );
      await contextValue.setApiKey("test_key");
    });

    // Reset mock for network error test
    mockFetch.mockImplementation(() =>
      Promise.reject(new Error("Network error"))
    );

    // Now test validation with network error
    await act(async () => {
      const result = await contextValue.validateApiKey();
      expect(result.isValid).toBeFalsy();
      expect(result.error).toContain("check your internet connection");
    });
  });

  it("should handle rate limit errors", async () => {
    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    // Set initial state
    await act(async () => {
      // First set a valid key
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ valid: true }),
        })
      );
      await contextValue.setApiKey("test_key");
    });

    // Reset mock for rate limit test
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 429,
      })
    );

    // Now test validation with rate limit error
    await act(async () => {
      const result = await contextValue.validateApiKey();
      expect(result.isValid).toBeFalsy();
      expect(result.error).toContain("Rate limit exceeded");
    });
  });

  it("should show clear button when API key is valid and clear functionality works", async () => {
    // Mock successful API validation
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ valid: true }),
      })
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    // Set a valid API key
    await act(async () => {
      await contextValue.setApiKey("valid_test_key");
    });

    // Verify state after setting valid key
    expect(contextValue.isValid).toBeTruthy();
    expect(contextValue.apiKey).toBe("valid_test_key");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "openrouter_api_key",
      "encrypted_valid_test_key"
    );

    // Clear the API key
    await act(async () => {
      contextValue.clearApiKey();
    });

    // Verify state after clearing
    expect(contextValue.isValid).toBeFalsy();
    expect(contextValue.apiKey).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "openrouter_api_key"
    );
  });

  it("should start in loading state and finish loading after initialization", async () => {
    let contextValue: ApiKeyContextType;

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    expect(contextValue!.isLoading).toBeTruthy();

    await waitFor(() => {
      expect(contextValue!.isLoading).toBeFalsy();
    });
  });

  it("should handle loading state during API key validation", async () => {
    const mockApiKey = "test_key_123";
    localStorageMock.getItem.mockReturnValue(`encrypted_${mockApiKey}`);

    // Delay the API response
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ valid: true }),
            });
          }, 100);
        })
    );

    render(
      <ApiKeyProvider>
        <TestComponent
          onMount={() => {
            contextValue = useApiKey();
          }}
        />
      </ApiKeyProvider>
    );

    expect(contextValue.isLoading).toBeTruthy();

    await waitFor(() => {
      expect(contextValue.isLoading).toBeFalsy();
      expect(contextValue.apiKey).toBe(mockApiKey);
      expect(contextValue.isValid).toBeTruthy();
    });
  });
});
