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
	currentTeam: string;
}

interface TeamStore extends TeamState {
	updateTeamInfo: (data: Partial<TeamState>) => void;
}

export const useTeamStore = create<TeamStore>()((set) => ({
	teams: [
		{
			id: "1",
			name: "Ali Awari",
			avatar:
				"https://vercel.com/api/www/avatar/8qz8aKrYCnaP9N23rC7jgnLmr?&s=160",
			avatarFallbackInitials: "AA",
		},
	],
	currentTeam: "1",
	updateTeamInfo: (data) => set(data),
}));
