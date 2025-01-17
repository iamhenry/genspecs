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

interface ApiKeyContextType {
  apiKey: string | null;
  isValid: boolean;
  setApiKey: (key: string) => Promise<void>;
  validateApiKey: () => Promise<boolean>;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = "openrouter_api_key";

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on mount
    const loadApiKey = async () => {
      const encryptedKey = localStorage.getItem(STORAGE_KEY);
      if (encryptedKey) {
        try {
          const decryptedKey = await decrypt(encryptedKey);
          setApiKeyState(decryptedKey);
          validateApiKey();
        } catch (error) {
          console.error("Failed to decrypt API key:", error);
          clearApiKey();
        }
      }
    };
    loadApiKey();
  }, []);

  const setApiKey = async (key: string) => {
    try {
      const encryptedKey = await encrypt(key);
      localStorage.setItem(STORAGE_KEY, encryptedKey);
      setApiKeyState(key);
      await validateApiKey();
    } catch (error) {
      console.error("Failed to set API key:", error);
      throw error;
    }
  };

  const validateApiKey = async () => {
    if (!apiKey) {
      setIsValid(false);
      return false;
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/auth/validate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isValidKey = response.ok;
      setIsValid(isValidKey);
      return isValidKey;
    } catch (error) {
      console.error("Failed to validate API key:", error);
      setIsValid(false);
      return false;
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
    setIsValid(false);
  };

  return (
    <ApiKeyContext.Provider
      value={{ apiKey, isValid, setApiKey, validateApiKey, clearApiKey }}
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
