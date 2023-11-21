import { create } from "zustand";

import { api } from "@/trpc/react";

import { useUserStore } from "./user";

const currentUser = useUserStore.getState();

interface TeamState {
	teams: any[];
	// teams: {
	// 	id?: string;
	// 	name: string;
	// 	url: string;
	// 	type: string;
	// 	avatar: string;
	// 	avatarFallbackInitials: string;
	// }[];
	selectedTeam: {
		id?: string;
		name: string;
		url: string;
		type: string;
		avatar: string;
		avatarFallbackInitials: string;
	};
}

interface TeamStore extends TeamState {
	updateSelectedTeam: (team: TeamState["selectedTeam"]) => void;
	setTeams: (teams: any) => void;
}

export const useTeamStore = create<TeamStore>()((set) => ({
	teams: [],
	selectedTeam: {
		name: currentUser.name,
		url: currentUser.url,
		type: currentUser.type,
		avatar: currentUser.avatar,
		avatarFallbackInitials: currentUser.avatarFallbackInitials,
	},
	updateSelectedTeam: (team) => set(() => ({ selectedTeam: team })),
	setTeams: async () => {
		// Use tRPC or another method to fetch data from the database
		const { data } = api.user.getUserAndTeam.useQuery();

		if (!data) {
			return set({ teams: [] });
		}

		return set({ teams: data.teams });
	},
}));
