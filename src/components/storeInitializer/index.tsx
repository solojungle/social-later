"use client";

import { useEffect, useRef } from "react";

import { TeamSchemaValues } from "@/schemas/team-schema";
import { UserSchemaValues } from "@/schemas/user-schema";
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

	useEffect(() => {
		if (!isInitialized.current) {
			useUserStore.setState(user);
			useTeamStore.setState({ selectedTeam: user });
			useTeamStore.setState({ teams });
			isInitialized.current = true;
		}
	}, [user, teams]);

	return null;
}
