"use client";

import { useEffect, useRef } from "react";

import { useTeamStore } from "@/stores/teams";
import { useUserStore } from "@/stores/user";

export function StoreInitializer({ user }: { user: any }) {
	const isInitialized = useRef(false);

	useEffect(() => {
		if (!isInitialized.current) {
			useUserStore.setState(user);
			useTeamStore.setState({ selectedTeam: user });
			isInitialized.current = true;
		}
	}, [user]);

	return null;
}
