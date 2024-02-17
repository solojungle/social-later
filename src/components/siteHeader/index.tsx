"use client";

import { api } from "@/trpc/react";

import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	const { data: userData } = api.user.getUser.useQuery();
	const { data: teamsData } = api.user.getTeams.useQuery();

	const { data: profilesData } = api.socials.getTwitterAccounts.useQuery(
		{
			id: teamsData?.[0]?.id || "",
		},
		{
			enabled: !!teamsData,
		},
	);

	return (
		<header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{profilesData && userData && (
				<StoreInitializer
					user={{ ...userData }}
					teams={teamsData || []}
					profiles={profilesData || []}
				/>
			)}
			{/* <NavigationBar /> */}
		</header>
	);
}
