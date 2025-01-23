import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGeneration } from "@/context/GenerationContext";
import { downloadDocuments } from "@/lib/download";
import { Download } from "lucide-react";

export function DownloadButton() {
  const { documents, projectDetails } = useGeneration();
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Check if all documents are generated and accepted
  const areAllDocumentsReady = React.useMemo(() => {
    return Object.values(documents).every(
      (doc) => doc.status === "accepted" || doc.status === "draft"
    );
  }, [documents]);

  // Check if any document is still generating
  const isGenerating = React.useMemo(() => {
    return Object.values(documents).some((doc) => doc.status === "generating");
  }, [documents]);

  // Get button label based on document states
  const getButtonLabel = (): string => {
    if (isDownloading) return "Preparing Download...";
    if (isGenerating) return "Documents Generating...";
    if (!areAllDocumentsReady) return "Waiting for Documents...";
    return "Download All Documents";
  };

  // Handle download click
  const handleDownload = async () => {
    console.log("Starting document download process...");
    try {
      setIsDownloading(true);

      // Prepare documents for download
      const docsToDownload = Object.entries(documents)
        .filter(
          ([, doc]) => doc.status === "accepted" || doc.status === "draft"
        )
        .map(([type, doc]) => ({
          name: `${type}.md`,
          content: doc.content,
        }));

      console.log(
        `Preparing to download ${docsToDownload.length} documents...`
      );

      await downloadDocuments(docsToDownload, projectDetails.name);
      console.log("Documents downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!areAllDocumentsReady || isGenerating || isDownloading}
      className="w-full bg-black hover:bg-black/90 text-white disabled:bg-zinc-200 disabled:text-zinc-500 font-normal text-xs font-chivo-mono h-auto p-3"
    >
      <Download className="mr-2 h-4 w-4" />
      {getButtonLabel()}
    </Button>
  );
}
