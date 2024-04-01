"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";
import { TeamSchemaValues } from "@/schemas/team-schema";
import {
	TeamMembersSchemaValues,
	UserSchemaValues,
} from "@/schemas/user-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";

export function StoreInitializer({
	user,
	teams,
	profiles,
	members,
}: {
	user: UserSchemaValues;
	teams: TeamSchemaValues[];
	profiles: PublicSocialProfilesSchemaValues[];
	members: TeamMembersSchemaValues[];
}) {
	const isInitialized = useRef(false);

	const params = useParams();

	useEffect(() => {
		if (!isInitialized.current) {
			// if (params.id) {
			// 	const selectedTeam = teams.find((team) => team.url === params.id);
			// 	// Redirect them to settings if they are not a member of the team
			// 	if (!selectedTeam) {
			// 		window.location.href = "/settings";
			// 		return;
			// 	}
			// 	useSelectedTeamStore.setState(selectedTeam || user);
			// } else {
			// 	useSelectedTeamStore.setState(user);
			// }
			// useTeamStore.setState({ teams });

			useUserStore.setState(user);
			useSelectedTeamStore.setState(teams[0] || {});
			useTeamMembersStore.setState({ members });
			useSocialProfilesStore.setState({
				profiles,
				currentProfileId: profiles[0]?.id,
			});
			isInitialized.current = true;
		}
	}, [user, teams, params.id, profiles, members]);

	return null;
}
