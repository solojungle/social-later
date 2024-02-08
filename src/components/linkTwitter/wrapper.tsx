"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { LinkTwitterButton } from ".";
import { Button } from "../ui/button";

export function OLDLinkTwitterWrapper() {
	const generateAuthLink = api.twitter.generateOAuth2URL.useQuery();
	const { data } = generateAuthLink;
	const { id: teamId } = useSelectedTeamStore();

	if (!data || !teamId) {
		return <Button variant="link">Loading...</Button>;
	}

	return (
		<LinkTwitterButton
			teamId={teamId}
			state={data.state}
			codeVerifier={data.codeVerifier}
			url={data.url}
		/>
	);
}
