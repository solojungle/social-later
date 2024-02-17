"use client";

import { TeamSchema } from "@/schemas/team-schema";
import { api } from "@/trpc/react";

import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	const { data: userData } = api.user.getUser.useQuery();
	const { data: teamsData } = api.user.getTeams.useQuery();

	const { data: profilesData } = api.socials.getTwitterAccounts.useQuery(
		{
			// Use the non-nullable assertion operator to assert that the value is not null or undefined
			id: teamsData?.[0]?.id!,
		},
		{
			// Use the safeParse method to safely parse the data
			enabled: TeamSchema.pick({ id: true }).safeParse(teamsData?.[0]?.id)
				.success,
		},
	);

	return (
		<header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{!!userData && (
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
