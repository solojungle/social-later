"use client";

import { api } from "@/trpc/react";

import { NavigationBar } from "../navigationbar";
import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	const { data: userData } = api.user.getUser.useQuery();
	const { data: teamsData } = api.user.getTeams.useQuery();

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
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<StoreInitializer
				user={{ ...userWithProperties }}
				teams={teamsArrayWithProperties}
			/>
			<NavigationBar />
		</header>
	);
}
