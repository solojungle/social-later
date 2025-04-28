"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { OLDLinkTwitterButton } from ".";
import { Button } from "../ui/button";

export function OLDLinkTwitterWrapper() {
  const generateAuthLink = api.oauth2.generateTwitterOAuth2URL.useQuery();
  const { data } = generateAuthLink;
  const { id: teamId } = useSelectedTeamStore();

  if (!data || !teamId) {
    return <Button variant="link">Loading...</Button>;
  }

  return (
    <OLDLinkTwitterButton
      codeVerifier={data.codeVerifier}
      state={data.state}
      teamId={teamId}
      url={data.url}
    />
  );
}
