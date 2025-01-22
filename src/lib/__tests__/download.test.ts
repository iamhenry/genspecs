import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateZip, downloadDocuments } from '../download';
import JSZip from 'jszip';

// Mock JSZip with tracking
const mockFile = vi.fn();
const mockGenerateAsync = vi.fn().mockResolvedValue(new Blob());

vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    file: mockFile,
    generateAsync: mockGenerateAsync
  }))
}));

describe('Document Download Functionality', () => {
  describe('generateZip()', () => {
    it('should create a zip file with all generated documents', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title' },
        { name: 'BOM.md', content: '## Bill of Materials' }
      ];

      await generateZip(documents);
      expect(JSZip).toHaveBeenCalled();
    });

    it('should maintain correct markdown formatting', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title\n\n## Description' }
      ];

      await generateZip(documents);
      expect(mockFile).toHaveBeenCalledWith(
        'README.md', 
        '# Project Title\n\n## Description'
      );
    });

    it('should preserve file hierarchy in zip structure', async () => {
      const documents = [
        { name: 'docs/README.md', content: '# Project Title' },
        { name: 'specs/BOM.md', content: '## Bill of Materials' }
      ];

      await generateZip(documents);
      expect(mockFile).toHaveBeenCalledWith('docs/README.md', '# Project Title');
      expect(mockFile).toHaveBeenCalledWith('specs/BOM.md', '## Bill of Materials');
    });

    it('should include all document types in zip', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title' },
        { name: 'BOM.md', content: '## Bill of Materials' },
        { name: 'ROADMAP.md', content: '## Project Roadmap' },
        { name: 'IMPLEMENTATION.md', content: '## Implementation Plan' }
      ];

      await generateZip(documents);
      
      expect(mockFile).toHaveBeenCalledTimes(4);
      expect(mockFile).toHaveBeenCalledWith('README.md', '# Project Title');
      expect(mockFile).toHaveBeenCalledWith('BOM.md', '## Bill of Materials');
      expect(mockFile).toHaveBeenCalledWith('ROADMAP.md', '## Project Roadmap');
      expect(mockFile).toHaveBeenCalledWith('IMPLEMENTATION.md', '## Implementation Plan');
    });

    it('should name files appropriately', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title' },
        { name: 'BOM.md', content: '## Bill of Materials' }
      ];

      await generateZip(documents);
      expect(mockFile).toHaveBeenCalledWith('README.md', expect.any(String));
      expect(mockFile).toHaveBeenCalledWith('BOM.md', expect.any(String));
    });
  });

  describe('downloadDocuments()', () => {
    beforeEach(() => {
      // Mock URL methods
      global.URL.createObjectURL = vi.fn();
      global.URL.revokeObjectURL = vi.fn();
      
      // Create and mock anchor element
      const mockAnchor = document.createElement('a');
      mockAnchor.click = vi.fn();
      document.createElement = vi.fn().mockReturnValue(mockAnchor);

      // Mock document.body methods
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
    });

    it('should initiate download with correct filename format', async () => {
      const mockAnchor = document.createElement('a');
      await downloadDocuments(
        [{ name: 'README.md', content: '# Project Title' }],
        'TestProject'
      );
      expect(mockAnchor.download).toBe('TestProject_docs.zip');
    });

    it('should properly clean up resources after download', async () => {
      const mockUrl = 'blob:test-url';
      (global.URL.createObjectURL as ReturnType<typeof vi.fn>).mockReturnValue(mockUrl);

      await downloadDocuments(
        [{ name: 'README.md', content: '# Project Title' }],
        'TestProject'
      );
      
      // Verify cleanup
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });

    it('should generate zip with correct blob type', async () => {
      await generateZip([{ name: 'README.md', content: '# Project Title' }]);
      expect(mockGenerateAsync).toHaveBeenCalledWith({ type: 'blob' });
    });

    it('should handle specific download failures', async () => {
      // Test different error scenarios
      const testCases = [
        {
          error: new Error('URL creation failed'),
          expectedMessage: 'Download failed: URL creation failed'
        },
        {
          error: 'Network error', // Non-Error object
          expectedMessage: 'Download failed: Unknown error'
        }
      ];

      for (const { error, expectedMessage } of testCases) {
        global.URL.createObjectURL = vi.fn(() => {
          throw error;
        });

        await expect(downloadDocuments(
          [{ name: 'README.md', content: '# Project Title' }],
          'TestProject'
        )).rejects.toThrow(expectedMessage);
      }
    });
  });
});
