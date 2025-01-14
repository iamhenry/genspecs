"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defineStepper } from "@stepperize/react";

const { useStepper, steps, utils } = defineStepper(
  { id: "readme", title: "README" },
  { id: "bom", title: "Bill of Materials" },
  { id: "download", title: "Download Documents" }
);

export function VerticalStepper() {
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold font-chivo-mono">
            Document Generator
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Document Steps" className="flex-1 overflow-y-auto px-6">
        <ol className="flex flex-col gap-2" aria-orientation="vertical">
          {stepper.all.map((step, index, array) => (
            <React.Fragment key={step.id}>
              <li className="flex items-center gap-4">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? "default" : "secondary"}
                  aria-current={
                    stepper.current.id === step.id ? "step" : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full"
                  onClick={() => stepper.goTo(step.id)}
                >
                  {index + 1}
                </Button>
                <span className="text-sm font-bold font-chivo-mono">
                  {step.title}
                </span>
              </li>
              {index < array.length - 1 && (
                <div className="flex gap-4">
                  <div className="flex justify-center pl-5">
                    <Separator
                      orientation="vertical"
                      className={`w-[1px] h-6 ${
                        index < currentIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>

      {/* Bottom Buttons */}
      <div className="p-6 pt-2">
        <div className="flex justify-between gap-4">
          <Button
            variant="secondary"
            onClick={stepper.prev}
            disabled={stepper.isFirst}
          >
            Back
          </Button>
          <Button
            onClick={stepper.isLast ? stepper.reset : stepper.next}
            variant={stepper.isLast ? "secondary" : "default"}
          >
            {stepper.isLast ? "Reset" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
