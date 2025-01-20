import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers);

// Mock environment variables
beforeAll(() => {
  process.env.NODE_ENV = 'development';
  process.env.OPENROUTER_API_KEY = 'test_key';
});

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 