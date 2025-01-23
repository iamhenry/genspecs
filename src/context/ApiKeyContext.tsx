/**
 * @fileoverview Context provider for managing OpenRouter API key state and operations.
 * Handles encryption, storage, validation, and access to the API key throughout the application.
 *
 * @module ApiKeyContext
 * @requires React
 * @requires encryption
 *
 * Features:
 * - Secure storage of API key using encryption
 * - Automatic validation against OpenRouter API
 * - Persistence in localStorage
 * - Type-safe context with TypeScript
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { encrypt, decrypt } from "@/lib/encryption";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ApiKeyContextType {
  apiKey: string | null;
  isValid: boolean;
  isLoading: boolean;
  setApiKey: (key: string) => Promise<ValidationResult>;
  validateApiKey: () => Promise<ValidationResult>;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = "openrouter_api_key";

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load API key from localStorage on mount
    const loadApiKey = async () => {
      setIsLoading(true);
      const encryptedKey = localStorage.getItem(STORAGE_KEY);
      if (encryptedKey) {
        try {
          const decryptedKey = await decrypt(encryptedKey);
          const validationResult = await validateApiKey(decryptedKey);
          if (validationResult.isValid) {
            setApiKeyState(decryptedKey);
            setIsValid(true);
          } else {
            clearApiKey();
          }
        } catch (error) {
          console.error("Failed to decrypt API key:", error);
          clearApiKey();
        }
      }
      setIsLoading(false);
    };
    loadApiKey();
  }, []);

  const validateApiKey = async (
    keyToValidate?: string
  ): Promise<ValidationResult> => {
    const keyToCheck = keyToValidate || apiKey;
    console.log("🔑 Starting API key validation...");

    if (!keyToCheck) {
      console.log("❌ No API key provided");
      setIsValid(false);
      return { isValid: false, error: "API key is required" };
    }

    try {
      console.log("🔄 Making request to OpenRouter auth/key endpoint...");
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keyToCheck}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`📡 Response status: ${response.status}`);

      // Handle specific error cases
      if (!response.ok) {
        setIsValid(false);
        let errorResult: ValidationResult;

        switch (response.status) {
          case 401:
            errorResult = {
              isValid: false,
              error: "Invalid API key. Please check your OpenRouter API key.",
            };
            console.log("❌ Error 401: Invalid API key");
            break;
          case 402:
            errorResult = {
              isValid: false,
              error:
                "Insufficient credits. Please add credits to your account.",
            };
            console.log("❌ Error 402: Insufficient credits");
            break;
          case 403:
            errorResult = {
              isValid: false,
              error: "Access forbidden. Please check your API key permissions.",
            };
            console.log("❌ Error 403: Access forbidden");
            break;
          case 429:
            errorResult = {
              isValid: false,
              error: "Rate limit exceeded. Please try again later.",
            };
            console.log("❌ Error 429: Rate limit exceeded");
            break;
          default:
            errorResult = {
              isValid: false,
              error: `Validation failed (Status: ${response.status})`,
            };
            console.log(`❌ Error ${response.status}: Unknown error`);
        }
        return errorResult;
      }

      // If response is ok, parse the response
      const data = await response.json();
      console.log("✅ API key validated successfully!", data);
      setIsValid(true);
      if (keyToValidate) {
        setApiKeyState(keyToValidate);
      }
      return { isValid: true };
    } catch (error) {
      console.error("❌ Validation error:", error);
      setIsValid(false);
      return {
        isValid: false,
        error:
          "Failed to validate API key. Please check your internet connection.",
      };
    }
  };

  const setApiKey = async (key: string): Promise<ValidationResult> => {
    try {
      console.log("🔐 Attempting to set new API key...");
      setIsLoading(true);
      // Validate first
      const validationResult = await validateApiKey(key);

      if (!validationResult.isValid) {
        console.log("❌ Validation failed, key not saved");
        setIsLoading(false);
        setIsValid(false);
        return validationResult;
      }

      // Only save if validation passes
      const encryptedKey = await encrypt(key);
      localStorage.setItem(STORAGE_KEY, encryptedKey);
      setApiKeyState(key);
      setIsValid(true);
      console.log("✅ API key encrypted and saved successfully");
      setIsLoading(false);
      return { isValid: true };
    } catch (error) {
      console.error("❌ Error saving API key:", error);
      setIsLoading(false);
      setIsValid(false);
      return {
        isValid: false,
        error: "Failed to save API key. Please try again.",
      };
    }
  };

  const clearApiKey = () => {
    console.log("🗑️ Clearing API key from storage");
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
    setIsValid(false);
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        isValid,
        isLoading,
        setApiKey,
        validateApiKey,
        clearApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
