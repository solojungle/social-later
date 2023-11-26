"use client";

import { useEffect, useRef } from "react";

import { TeamSchemaValues } from "@/schemas/team/team-schema";
import { UserSchemaValues } from "@/schemas/user/user-schema";
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

	useEffect(() => {
		if (!isInitialized.current) {
			useUserStore.setState(user);
			useSelectedTeamStore.setState(user);
			useTeamStore.setState({ teams });
			isInitialized.current = true;
		}
	}, [user, teams]);

	return null;
}
