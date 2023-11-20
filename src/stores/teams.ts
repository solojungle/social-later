import { create } from "zustand";

interface TeamState {
	teams: {
		id?: string;
		name: string;
		avatar: string;
		avatarFallbackInitials: string;
	}[];
	selectedTeam: {
		id?: string;
		name: string;
		avatar: string;
		avatarFallbackInitials: string;
	};
}

interface TeamStore extends TeamState {
	updateSelectedTeam: (team: TeamState["selectedTeam"]) => void;
}

export const useTeamStore = create<TeamStore>()((set) => ({
	teams: [
		{
			id: "1",
			name: "Awari Industries",
			avatar: "https://avatar.vercel.sh/Awari?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "2",
			name: "Dog Water",
			avatar: "https://avatar.vercel.sh/DogWater?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "3",
			name: "ACME",
			avatar: "https://avatar.vercel.sh/ACME?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "4",
			name: "MentosArcher",
			avatar: "https://avatar.vercel.sh/MentosArcher?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "5",
			name: "GlitterBot",
			avatar: "https://avatar.vercel.sh/GlitterBot?&s=160",
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
	updateSelectedTeam: (team) => set(() => ({ selectedTeam: team })),
}));
