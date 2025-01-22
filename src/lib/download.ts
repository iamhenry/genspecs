import JSZip from 'jszip';

interface Document {
  name: string;
  content: string;
}

export async function generateZip(documents: Document[]): Promise<Blob> {
  const zip = new JSZip();
  
  documents.forEach(doc => {
    zip.file(doc.name, doc.content);
  });

  return zip.generateAsync({ type: 'blob' });
}

export async function downloadDocuments(documents: Document[], projectName: string): Promise<void> {
  try {
    const zip = await generateZip(documents);
    const url = URL.createObjectURL(zip);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}_docs.zip`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
