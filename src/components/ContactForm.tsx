/**
 * @file Contact Form Component
 * @description A form component for project information collection.
 * Includes fields for project name, description, and user stories.
 * Uses Zod for form validation and custom styling with Tailwind CSS.
 *
 * @component
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 */

"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  userStories: z.string().min(10, {
    message: "User stories must be at least 10 characters.",
  }),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      userStories: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <Input
                  placeholder="Enter your project name"
                  {...field}
                  className="border-0 bg-white rounded-2xl px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-neutral-800 text-base font-bold font-chivo-mono">
                Description & Tech Stack
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project overview and tech stack"
                  {...field}
                  className="min-h-[120px] border-0 bg-white rounded-2xl px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-neutral-400 text-sm font-normal leading-7 font-sans"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userStories"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-neutral-800 text-base font-bold font-chivo-mono">
                User Stories
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Eg. As a user, I want to [feature] so that [benefit]"
                  {...field}
                  className="min-h-[120px] border-0 bg-white rounded-2xl px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-neutral-400 text-sm font-normal leading-7 font-sans"
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
          Generate
        </Button>
      </form>
    </Form>
  );
}
