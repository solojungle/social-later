"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";

import { SettingsCardBase } from "../settings-card-base";

export const Personal2FAFormSchema = z.object({
  url: z
    .string()
    .min(1, {
      message: "URL must be at least 1 character.",
    })
    .max(48, {
      message: "URL must not be longer than 48 characters.",
    }),
});

export function Personal2FACard() {
  return (
    <SettingsCardBase
      content={
        <div className="grid">
          <div className="flex items-center justify-between space-x-2">
            <Label className="flex flex-col" htmlFor="necessary">
              <span>Enable two-step verification for your login</span>
            </Label>
            <Switch id="necessary" />
          </div>
        </div>
      }
      description="Two-Step Verification requires you to enter a six-digit code while logging in."
      footerSubtitle="Turning on this option will require you to complete a setup process using an Authenticator application on a mobile device."
      title="Two-Step Verification"
    />
  );
}
