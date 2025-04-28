"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import * as z from "zod";

import { SettingsCardBase } from "../settings-card-base";

export const PersonalPasswordFormSchema = z.object({
  url: z
    .string()
    .min(1, {
      message: "URL must be at least 1 character.",
    })
    .max(48, {
      message: "URL must not be longer than 48 characters.",
    }),
});

interface PersonalPasswordCardProps {
  formControl: Control<any, any>;
}

export function PersonalPasswordCard({
  formControl,
}: PersonalPasswordCardProps) {
  return (
    <SettingsCardBase
      content={
        <FormField
          control={formControl}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
      description="Your username acts also acts as your URL namespace."
      footerSubtitle="Please use 48 characters at maximum."
      title="Change Password"
    />
  );
}
