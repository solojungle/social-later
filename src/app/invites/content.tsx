"use client";

import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

type InvitesPageContentProps = {
  isLoggedIn: boolean;
};

export function InvitesPageContent({ isLoggedIn }: InvitesPageContentProps) {
  const [inviteCode] = useQueryState("inviteCode", {
    defaultValue: "",
  });

  const utils = api.useUtils();
  const { mutate: acceptInvite } = api.invitation.accept.useMutation({
    onSettled: () => {
      // remove the invite code from the URL
      redirect("/publish");
    },
    onSuccess: () => {
      // Refetch the team
      utils.team.getMembers.invalidate();
    },
  });

  // 1. If the user is not logged in, redirect to the login page with the invite code which will redirect back to here.
  if (!isLoggedIn) {
    redirect(`/login?inviteCode=${inviteCode}`);
  }

  // 2. If the user is already logged in, add them to the team, then redirect to the publish page
  // Wrapping in useEffect to avoid calling acceptInvite on every render
  useEffect(() => {
    if (inviteCode) {
      acceptInvite({
        inviteCode,
      });
    }
  }, [acceptInvite, inviteCode]);

  redirect("/publish");

  return null;
}
