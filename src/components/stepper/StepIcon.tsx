import { Circle, CircleCheck, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { EightBitSpinner } from "@/components/ui/EightBitSpinner";

export type StepIconState = "idle" | "loading" | "done" | "error";

interface StepIconProps {
  state: StepIconState;
  className?: string;
}

export function StepIcon({ state, className }: StepIconProps) {
  return (
    <div className={cn("relative w-4 h-4", className)}>
      {state === "idle" && <Circle className="w-4 h-4 text-gray-400" />}

      {state === "loading" && (
        <div className="w-4 h-4">
          <EightBitSpinner
            size={16}
            color="currentColor"
            className="text-gray-600"
          />
        </div>
      )}

      {state === "done" && <CircleCheck className="w-4 h-4 text-green-500" />}

      {state === "error" && <CircleAlert className="w-4 h-4 text-red-500" />}
    </div>
  );
}

// Add the loader animation styles
const loaderStyles = `
  #loader {
    animation: spin 1s linear infinite;
    height: 10px;
    width: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -5px;
  }

  @keyframes spin {
    0% {
      box-shadow: 
        0px -30px #000, 
        10px -30px #000, 
        20px -20px #000, 
        30px -10px #000, 
        30px 0px #000, 
        30px 10px #000, 
        20px 20px #000, 
        10px 30px #000, 
        0px 30px transparent, 
        -10px 30px transparent, 
        -20px 20px transparent, 
        -30px 10px transparent, 
        -30px 0px transparent, 
        -30px -10px transparent, 
        -20px -20px transparent,
        -10px -30px transparent;
    }
    /* ... rest of the keyframes ... */
    100% {
      box-shadow: 
        0px -30px #000, 
        10px -30px #000, 
        20px -20px #000, 
        30px -10px #000, 
        30px 0px #000, 
        30px 10px #000, 
        20px 20px #000, 
        10px 30px #000, 
        0px 30px transparent, 
        -10px 30px transparent, 
        -20px 20px transparent, 
        -30px 10px transparent, 
        -30px 0px transparent, 
        -30px -10px transparent, 
        -20px -20px transparent,
        -10px -30px transparent;
    }
  }
`;

// Add styles to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = loaderStyles;
  document.head.appendChild(style);
}
