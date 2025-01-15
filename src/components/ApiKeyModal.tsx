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

import React from "react";
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

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
});

export function ApiKeyModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl">
          Set Openrouter API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-neutral-800 text-base font-bold font-chivo-mono">
            Set Openrouter Your API Key
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
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 rounded-2xl p-3 h-auto font-normal text-xs font-chivo-mono"
            >
              Save API Key
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
