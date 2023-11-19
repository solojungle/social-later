import { create } from "zustand";

interface TeamState {
	teams: [
		{
			id: string;
			name: string;
			avatar: string;
			avatarFallbackInitials: string;
		},
	];
	selectedTeam: {
		id: string;
		name: string;
		avatar: string;
		avatarFallbackInitials: string;
	};
}

interface TeamStore extends TeamState {
	updateTeamInfo: (data: Partial<TeamState>) => void;
}

export const useTeamStore = create<TeamStore>()((set) => ({
	teams: [
		{
			id: "1",
			name: "Awari Industries",
			avatar:
				"https://vercel.com/api/www/avatar/8qz8aKrYCnaP9N23rC7jgnLmr?&s=160",
			avatarFallbackInitials: "AA",
		},
	],
	selectedTeam: {
		id: "1",
		name: "Awari Industries",
		avatar:
			"https://vercel.com/api/www/avatar/8qz8aKrYCnaP9N23rC7jgnLmr?&s=160",
		avatarFallbackInitials: "AA",
	},
	updateTeamInfo: (data) => set(data),
}));
