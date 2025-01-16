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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/context/ApiKeyContext";
import { EightBitSpinner } from "./ui/EightBitSpinner";

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
});

export function ApiKeyModal() {
  const { setApiKey, apiKey, isValid, clearApiKey } = useApiKey();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      setIsLoading(true);
      await setApiKey(values.apiKey);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save API key:", error);
      form.setError("apiKey", {
        type: "manual",
        message: "Failed to save API key. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isValid ? "outline" : "default"}
          className="rounded-2xl"
          onClick={() => isValid && clearApiKey()}
        >
          {isValid ? "Clear API Key" : "Set Openrouter API Key"}
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
                      className="border-0 bg-white rounded-2xl px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 rounded-2xl p-3 h-auto font-normal text-xs font-chivo-mono"
              disabled={isLoading}
            >
              {isLoading ? <EightBitSpinner /> : "Save API Key"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
