/**
 * @file API Key Modal Component
 * @description A modal dialog component that allows users to input and save their Openrouter API key.
 * Uses form validation with Zod schema and provides a secure password input field.
 *
 * @component
 * @example
 * ```tsx
 * <ApiKeyModal />
 * ```
 */

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/context/ApiKeyContext";
import { EightBitSpinner } from "./ui/EightBitSpinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
});

export function ApiKeyModal() {
  const { setApiKey, apiKey, isValid, isLoading, clearApiKey } = useApiKey();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: apiKey || "",
    },
  });

  // Update form when apiKey changes
  useEffect(() => {
    if (apiKey) {
      form.setValue("apiKey", apiKey);
    }
  }, [apiKey, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await setApiKey(values.apiKey);

      if (!result.isValid) {
        form.setError("apiKey", {
          type: "manual",
          message: result.error || "Failed to validate API key",
        });
        return;
      }

      // Only close if validation succeeded
      setIsOpen(false);
      form.reset();

      // Show success toast after dialog is closed
      setTimeout(() => {
        toast({
          title: "API Key Saved",
          description:
            "Your OpenRouter API key has been successfully validated and saved.",
        });
      }, 100);
    } catch (error) {
      console.error("Failed to save API key:", error);
      form.setError("apiKey", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isValid ? "outline" : "default"}
          className={cn(
            "rounded-full font-chivo-mono",
            isValid
              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              : "bg-black hover:bg-black/90 text-white"
          )}
          onClick={() => isValid && clearApiKey()}
          disabled={isLoading}
        >
          {isLoading ? (
            <EightBitSpinner />
          ) : isValid ? (
            "Clear API Key"
          ) : (
            "Set Openrouter API Key"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-neutral-800 text-base font-bold font-chivo-mono">
            Set Your Openrouter API Key
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-neutral-800 text-sm font-medium">
                    API Key
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your API key"
                      type="password"
                      {...field}
                      className="!border-1 border-zinc-100 bg-white rounded-full px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-500">
                    Get your API key from{" "}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      openrouter.ai/keys
                    </a>
                  </FormDescription>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-white disabled:bg-zinc-200 disabled:text-zinc-500 rounded-full p-3 h-auto font-normal text-xs font-chivo-mono"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? <EightBitSpinner /> : "Save API Key"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
