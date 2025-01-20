import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReadme } from '../llm';
import { GenerationState } from '@/types/generation';

describe('README Generator', () => {
  const mockProjectDetails: GenerationState['projectDetails'] = {
    name: 'Test Project',
    description: 'A test project using Next.js and TypeScript with Tailwind CSS',
    userStories: [
      'As a user, I want to create projects',
      'As a user, I want to manage specifications'
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate README when all required fields are provided', async () => {
    const result = await generateReadme(mockProjectDetails);

    expect(result).toBeDefined();
    expect(result.content).toContain('# Test Project');
    expect(result.content).toContain('## Description');
    expect(result.content).toContain('## User Stories');
    expect(result.status).toBe('draft');
  });

  it('should throw error when required fields are missing', async () => {
    const invalidProjectDetails = {
      ...mockProjectDetails,
      name: '',
    };

    await expect(generateReadme(invalidProjectDetails)).rejects.toThrow(
      'Project name is required'
    );
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    const result = await generateReadme(mockProjectDetails);

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API Error');
  });

  it('should maintain existing document state on error', async () => {
    // Mock API error
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    const existingContent = '# Existing README';
    const result = await generateReadme(mockProjectDetails, existingContent);

    expect(result.content).toBe(existingContent);
    expect(result.status).toBe('error');
  });
}); 