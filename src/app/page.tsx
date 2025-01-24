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
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { currentStep: activeStepId } = useGeneration();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] flex flex-col gap-4">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          <h4 className="text-xl font-bold text-center font-chivo-mono">
            GenSpecs
          </h4>
          <ApiKeyModal />
        </motion.div>
        <motion.div
          layout
          layoutId="container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.645, 0.045, 0.355, 1.0],
            layout: {
              duration: 0.4,
              ease: [0.645, 0.045, 0.355, 1.0],
            },
          }}
          className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-gray-200 w-full h-full"
        >
          <motion.div
            layout
            className="p-10 h-full"
            transition={{
              layout: {
                duration: 0.4,
                ease: [0.645, 0.045, 0.355, 1.0],
              },
            }}
          >
            <AnimatePresence mode="wait">
              {!activeStepId ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  <ContactForm />
                </motion.div>
              ) : (
                <motion.div
                  key="vertical-stepper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  <VerticalStepper />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        <motion.h3
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.8, // Appears after contact form and API key button
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          Made by{" "}
          <a
            href="https://x.com/soyhenryxyz"
            className="hover:text-foreground transition-colors"
          >
            @soyhenryxyz
          </a>{" "}
          <br />
          Code on{" "}
          <a
            href="https://github.com/iamhenry/genspecs"
            className="hover:text-foreground transition-colors"
          >
            Github
          </a>
        </motion.h3>
      </div>
    </div>
  );
}
