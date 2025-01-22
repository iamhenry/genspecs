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
    });

    it('should initiate download with correct filename', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title' }
      ];
      const projectName = 'TestProject';

      await downloadDocuments(documents, projectName);
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should handle download failures', async () => {
      const documents = [
        { name: 'README.md', content: '# Project Title' }
      ];
      const projectName = 'TestProject';

      // Simulate download failure
      global.URL.createObjectURL = vi.fn(() => {
        throw new Error('Download failed');
      });

      await expect(downloadDocuments(documents, projectName))
        .rejects
        .toThrow('Download failed');
    });
  });
});
