"use client";

import { useState } from "react";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { VerticalStepper } from "@/components/stepper/VerticalStepper";

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step | undefined>();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[960px] h-[90vh]">
        <div className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-gray-200 p-10 w-full h-full">
          <TwoColumnLayout
            leftContent={<VerticalStepper onChange={setCurrentStep} />}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}
