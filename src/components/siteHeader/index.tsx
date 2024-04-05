/* eslint-disable prettier/prettier */

"use client";

import { TeamSchema } from "@/schemas/team-schema";
import { api } from "@/trpc/react";

import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	const { data: userData } = api.user.getUser.useQuery();
	const { data: teamsData, isLoading: teamIsLoading } =
		api.user.getTeams.useQuery();

	const {
		data: profilesData,
		isLoading: profilesIsLoading,
		isFetching: profilesIsFetching,
	} = api.socials.getSocialProfiles.useQuery(
		{
			// Use the non-nullable assertion operator to assert that the value is not null or undefined
			id: teamsData?.[0]?.id!,
		},
		{
			// Use the safeParse method to safely parse the data
			enabled: TeamSchema.pick({ id: true }).safeParse({
				id: teamsData?.[0]?.id,
			}).success,
		},
	);

	// Get team members
	const {
		data: teamMembersData,
		isLoading: teamMembersIsLoading,
		isFetching: teamMembersIsFetching,
	} = api.team.getMembers.useQuery(
		{
			// Use the non-nullable assertion operator to assert that the value is not null or undefined
			id: teamsData?.[0]?.id!,
		},
		{
			// Use the safeParse method to safely parse the data
			enabled: TeamSchema.pick({ id: true }).safeParse({
				id: teamsData?.[0]?.id,
			}).success,
		},
	);

	return (
		<div>
			{!!userData &&
				(!profilesIsLoading || !profilesIsFetching) &&
				(!teamMembersIsLoading || !teamMembersIsFetching) &&
				!teamIsLoading && (
				<StoreInitializer
					user={{ ...userData }}
					teams={teamsData || []}
					profiles={profilesData || []}
					members={teamMembersData || []}
				/>
			)}
		</div>
	);
}
