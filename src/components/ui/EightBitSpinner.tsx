import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EightBitSpinnerProps {
  className?: string;
  color?: string;
}

export function EightBitSpinner({
  className,
  color = "#000",
}: EightBitSpinnerProps) {
  useEffect(() => {
    const styleId = "eight-bit-spinner-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .eight-bit-spinner {
          animation: eight-bit-spin 1s linear infinite;
          height: 10px;
          width: 10px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -5px;
        }

        @keyframes eight-bit-spin {
          0% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          6.25% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          12.5% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          18.75% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          25% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          31.25% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          37.5% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px ${color}, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px transparent,
              -10px -30px transparent;
          }
          43.75% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px ${color}, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px transparent;
          }
          50% {
            box-shadow: 
              0px -30px transparent, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px ${color}, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          56.25% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px transparent, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px ${color}, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          62.5% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px transparent, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px ${color}, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          68.75% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px transparent, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px ${color}, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          75% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px transparent, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px ${color}, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          81.25% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px transparent, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px ${color}, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          87.5% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px transparent, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px ${color},
              -10px -30px ${color};
          }
          93.75% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px transparent, 
              0px 30px transparent, 
              -10px 30px transparent, 
              -20px 20px transparent, 
              -30px 10px transparent, 
              -30px 0px transparent, 
              -30px -10px transparent, 
              -20px -20px transparent,
              -10px -30px ${color};
          }
          100% {
            box-shadow: 
              0px -30px ${color}, 
              10px -30px ${color}, 
              20px -20px ${color}, 
              30px -10px ${color}, 
              30px 0px ${color}, 
              30px 10px ${color}, 
              20px 20px ${color}, 
              10px 30px ${color}, 
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
      document.head.appendChild(style);
    }
  }, [color]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="eight-bit-spinner" />
    </div>
  );
}
