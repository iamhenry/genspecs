import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EightBitSpinnerProps {
  className?: string;
  color?: string;
  size?: number;
}

export function EightBitSpinner({
  className,
  color = "#000",
  size = 16,
}: EightBitSpinnerProps) {
  useEffect(() => {
    const styleId = "eight-bit-spinner-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .eight-bit-spinner {
          animation: eight-bit-spin 1s linear infinite;
          height: ${size / 3}px;
          width: ${size / 3}px;
          position: relative;
          display: inline-block;
          transform: scale(0.5);
        }

        @keyframes eight-bit-spin {
          0% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px transparent, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          6.25% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px transparent, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          12.5% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          18.75% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          25% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          31.25% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px transparent, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px transparent,
              -${size / 3}px -${size}px transparent;
          }
          37.5% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          43.75% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          50% {
            box-shadow: 
              0px -${size}px transparent, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px ${color}, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          56.25% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px transparent, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          62.5% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px transparent, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          68.75% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px transparent, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          75% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px transparent, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px ${color}, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          81.25% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px transparent, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          87.5% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          93.75% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px transparent, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
          100% {
            box-shadow: 
              0px -${size}px ${color}, 
              ${size / 3}px -${size}px ${color}, 
              ${(size / 3) * 2}px -${(size / 3) * 2}px ${color}, 
              ${size}px -${size / 3}px ${color}, 
              ${size}px 0px ${color}, 
              ${size}px ${size / 3}px ${color}, 
              ${(size / 3) * 2}px ${(size / 3) * 2}px ${color}, 
              ${size / 3}px ${size}px ${color}, 
              0px ${size}px transparent, 
              -${size / 3}px ${size}px ${color}, 
              -${(size / 3) * 2}px ${(size / 3) * 2}px transparent, 
              -${size}px ${size / 3}px transparent, 
              -${size}px 0px transparent, 
              -${size}px -${size / 3}px ${color}, 
              -${(size / 3) * 2}px -${(size / 3) * 2}px ${color},
              -${size / 3}px -${size}px ${color};
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, [color, size]);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <div className="eight-bit-spinner" />
    </div>
  );
}
