"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/trpc/react";

type InvitesPageContentProps = {
	isLoggedIn: boolean;
};

export function InvitesPageContent({ isLoggedIn }: InvitesPageContentProps) {
	const searchParams = useSearchParams();
	const inviteCode = searchParams.get("inviteCode");
	const utils = api.useUtils();
	const { mutate: acceptInvite } = api.invitation.accept.useMutation({
		onSuccess: () => {
			// Refetch the team
			utils.team.getMembers.invalidate();
		},
		onSettled: () => {
			// remove the invite code from the URL
			redirect("/publish");
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
