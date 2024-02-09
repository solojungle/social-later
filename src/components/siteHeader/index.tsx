"use client";

import { api } from "@/trpc/react";

import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	const { data: userData } = api.user.getUser.useQuery();
	const { data: teamsData } = api.user.getTeams.useQuery();

	const { data: profilesData } = api.socials.getTwitterAccounts.useQuery(
		{
			id: teamsData?.[0]?.team.id || "",
		},
		{
			enabled: !!teamsData,
		},
	);

	if (!userData || !teamsData) {
		return null;
	}

	const teamsArray = teamsData.map((team) => team.team);

	// Now create a new teams array that has the properties: type, and imageFallbackInitials
	const teamsArrayWithProperties = teamsArray.map((team) => {
		return {
			...team,
			type: "team",
			imageFallbackInitials: "TT",
		};
	});

	const userWithProperties = {
		...userData,
		type: "personal",
		imageFallbackInitials: "AA",
	};

	return (
		<header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{profilesData && (
				<StoreInitializer
					user={{ ...userWithProperties }}
					teams={teamsArrayWithProperties}
					profiles={profilesData || []}
				/>
			)}
			{/* <NavigationBar /> */}
		</header>
	);
}
