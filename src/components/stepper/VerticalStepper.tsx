/**
 * @file Vertical Stepper Component
 * @description A vertical stepper navigation component that manages multi-step workflow.
 * Features numbered steps, progress indication, and navigation controls.
 * Integrates with @stepperize/react for state management.
 *
 * @component
 * @example
 * ```tsx
 * <VerticalStepper onChange={(step) => handleStepChange(step)} />
 * ```
 */

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defineStepper } from "@stepperize/react";
import { StepIcon, StepIconState } from "@/components/stepper/StepIcon";
import { useGeneration } from "@/context/GenerationContext";
import { DocumentType } from "@/types/generation";
import { DownloadButton } from "./DownloadButton";

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
  state?: StepIconState;
}

interface VerticalStepperProps {
  onChange?: (step: Step) => void;
}

// Define all steps in one place for easy management
const STEPS: Step[] = [
  {
    id: "readme",
    title: "README",
    content: <div>README content goes here</div>,
  },
  {
    id: "bom",
    title: "Bill of Materials",
    content: <div>Bill of Materials content goes here</div>,
  },
  {
    id: "roadmap",
    title: "Roadmap",
    content: <div>Roadmap content goes here</div>,
  },
  {
    id: "implementation",
    title: "Implementation Plan",
    content: <div>Implementation Plan content goes here</div>,
  },
];

// Create stepper from steps array
const { useStepper, steps, utils } = defineStepper(
  ...STEPS.map(({ id, title }) => ({ id, title }))
);

export function VerticalStepper({ onChange }: VerticalStepperProps) {
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);
  const { documents, setCurrentStep, updateDocument } = useGeneration();

  // Get step state based on document status
  const getStepState = (stepId: string): StepIconState => {
    const docType = stepId as DocumentType;
    const doc = documents[docType];

    if (!doc) return "idle";

    switch (doc.status) {
      case "generating":
        return "loading";
      case "accepted":
        return "done";
      case "error":
        return "error";
      default:
        return "idle";
    }
  };

  // Handle step navigation
  const handleStepChange = (stepId: string) => {
    const currentDoc = documents[stepper.current.id as DocumentType];
    const targetDoc = documents[stepId as DocumentType];

    // Mark current step as done if moving forward
    if (currentDoc && utils.getIndex(stepId) > currentIndex) {
      updateDocument(stepper.current.id as DocumentType, {
        status: "accepted",
      });
    }

    // Start generating target document if not already done
    if (targetDoc && targetDoc.status === "idle") {
      updateDocument(stepId as DocumentType, { status: "generating" });
    }

    stepper.goTo(stepId);
  };

  // Call onChange whenever the current step changes
  React.useEffect(() => {
    const currentStep = STEPS[currentIndex];
    onChange?.(currentStep);
    setCurrentStep(currentStep.id);

    // Start generating current document if idle
    const currentDoc = documents[currentStep.id as DocumentType];
    if (currentDoc && currentDoc.status === "idle") {
      console.log(`Starting generation for ${currentStep.id}`);
      updateDocument(currentStep.id as DocumentType, { status: "generating" });
    }
  }, [currentIndex]); // Only depend on currentIndex changes

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-chivo-mono">Document</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Document Steps" className="flex-1 overflow-y-auto">
        <ol className="flex flex-col" aria-orientation="vertical">
          {stepper.all.map((step, index, array) => (
            <React.Fragment key={step.id}>
              <li className="flex items-center gap-2">
                <Button
                  type="button"
                  role="tab"
                  variant="ghost"
                  aria-current={
                    stepper.current.id === step.id ? "step" : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full p-0 hover:bg-transparent"
                  onClick={() => handleStepChange(step.id)}
                >
                  <StepIcon state={getStepState(step.id)} className="w-4 h-4" />
                </Button>
                <span
                  className={`text-sm font-bold font-chivo-mono ${
                    getStepState(step.id) === "idle" &&
                    stepper.current.id !== step.id
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </li>
              {index < array.length - 1 && (
                <div className="flex">
                  <div className="flex justify-center pl-5">
                    <Separator
                      orientation="vertical"
                      className={`w-[1px] h-4 ${
                        getStepState(step.id) === "done"
                          ? "bg-[#22c55e]"
                          : "bg-muted"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>

      {/* Download Button */}
      <div className="pt-10">
        <DownloadButton />
      </div>
    </div>
  );
}
