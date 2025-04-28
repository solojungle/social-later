"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function LinkTwitterButton({ teamId }: { teamId: string }) {
  // Disable the query and refetch on click
  const generateAuthLink = api.oauth2.generateTwitterOAuth2URL.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const router = useRouter();

  async function handleClick() {
    const { data } = await generateAuthLink.refetch();

    // Set cookies
    document.cookie = `codeVerifier=${data?.codeVerifier}`;
    document.cookie = `state=${data?.state}`;
    document.cookie = `teamId=${teamId}`;

    // Redirect to Twitter
    if (data?.url) {
      router.push(data.url);
    }
  }

  if (!teamId) {
    return null;
  }

  return (
    <button
      className="flex select-none flex-col items-center justify-center rounded-lg border-2 border-border p-10 transition-colors duration-200 ease-in-out hover:bg-secondary"
      onClick={handleClick}
      type="button"
    >
      <img
        alt="Twitter logo"
        className="mb-2 h-8 w-8"
        src="/logos/twitter_logo.webp"
      />
      <p className="font-medium">Twitter</p>
    </button>
  );
}
