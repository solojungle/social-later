"use client";

import { env } from "@/env.mjs";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageleave: true,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    person_profiles: "identified_only",
  });
}

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
