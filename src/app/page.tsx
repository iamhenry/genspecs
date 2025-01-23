/**
 * @file Home Page Component
 * @description Main landing page component that handles the layout and integration of key features
 * including API key management and contact form. Uses a responsive design with centered content.
 *
 * @component
 * @example
 * ```tsx
 * <Home />
 * ```
 */

"use client";

import { VerticalStepper } from "@/components/stepper/VerticalStepper";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ContactForm } from "@/components/ContactForm";
import { useGeneration } from "@/context/GenerationContext";

export default function Home() {
  const { currentStep: activeStepId } = useGeneration();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] flex flex-col gap-4">
        <div className="flex justify-end">
          <ApiKeyModal />
        </div>
        <div className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-gray-200 w-full h-full">
          <div className="p-10 h-full">
            {!activeStepId ? <ContactForm /> : <VerticalStepper />}
          </div>
        </div>
      </div>
    </div>
  );
}
