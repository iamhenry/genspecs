import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface TwoColumnLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export function TwoColumnLayout({
  leftContent,
  rightContent,
}: TwoColumnLayoutProps) {
  return (
    <div className="mx-auto max-w-[960px]">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={33.33} minSize={33.33} maxSize={33.33}>
          {leftContent}
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel defaultSize={66.67} minSize={66.67} maxSize={66.67}>
          {rightContent}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
