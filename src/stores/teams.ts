import { create } from "zustand";

import { api } from "@/trpc/react";

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
		id: "1",
		name: "Awari Industries",
		url: "awariinc",
		type: "team",
		avatar: "https://avatar.vercel.sh/Awari?&s=160",
		avatarFallbackInitials: "AA",
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
