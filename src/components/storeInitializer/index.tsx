"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { TeamSchemaValues } from "@/schemas/team-schema";
import { UserSchemaValues } from "@/schemas/user-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";
import { useUserStore } from "@/stores/user";

export function StoreInitializer({
	user,
	teams,
}: {
	user: UserSchemaValues;
	teams: TeamSchemaValues[];
}) {
	const isInitialized = useRef(false);

	const params = useParams();

	useEffect(() => {
		if (!isInitialized.current) {
			useUserStore.setState(user);

			if (params.id) {
				const selectedTeam = teams.find((team) => team.url === params.id);

				// Redirect them to settings if they are not a member of the team
				if (!selectedTeam) {
					window.location.href = "/settings";
					return;
				}

				useSelectedTeamStore.setState(selectedTeam || user);
			} else {
				useSelectedTeamStore.setState(user);
			}

			useTeamStore.setState({ teams });
			isInitialized.current = true;
		}
	}, [user, teams, params.id]);

	return null;
}
