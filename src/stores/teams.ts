import { create } from "zustand";

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
}));
