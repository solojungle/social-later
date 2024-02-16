"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { Button } from "../ui/button";
import { OLDLinkTwitterButton } from ".";

export function OLDLinkTwitterWrapper() {
	const generateAuthLink = api.twitter.generateOAuth2URL.useQuery();
	const { data } = generateAuthLink;
	const { id: teamId } = useSelectedTeamStore();

	if (!data || !teamId) {
		return <Button variant="link">Loading...</Button>;
	}

	return (
		<OLDLinkTwitterButton
			teamId={teamId}
			state={data.state}
			codeVerifier={data.codeVerifier}
			url={data.url}
		/>
	);
}
