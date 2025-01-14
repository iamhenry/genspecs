import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface TwoColumnLayoutProps {
  leftContent: ReactNode;
  rightContent?: ReactNode;
  currentStep?: {
    title: string;
    content: ReactNode;
  };
}

export function TwoColumnLayout({
  leftContent,
  rightContent,
  currentStep,
}: TwoColumnLayoutProps) {
  return (
    <div className="h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        <ResizablePanel
          defaultSize={33.33}
          minSize={33.33}
          maxSize={33.33}
          className="overflow-y-auto"
        >
          {leftContent}
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel
          defaultSize={66.67}
          minSize={66.67}
          maxSize={66.67}
          className="overflow-y-auto"
        >
          <div className="p-6">
            {currentStep && (
              <>
                <h2 className="text-2xl font-bold font-chivo-mono mb-4">
                  {currentStep.title}
                </h2>
                {currentStep.content}
              </>
            )}
            {!currentStep && rightContent}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
