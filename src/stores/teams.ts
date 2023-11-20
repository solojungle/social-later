import { create } from "zustand";

interface TeamState {
	teams: {
		id?: string;
		name: string;
		url: string;
		type: string;
		avatar: string;
		avatarFallbackInitials: string;
	}[];
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
	teams: [
		{
			id: "1",
			name: "Awari Industries",
			url: "awariinc",
			type: "team",
			avatar: "https://avatar.vercel.sh/Awari?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "2",
			name: "Dog Water",
			url: "doggywater",
			type: "team",
			avatar: "https://avatar.vercel.sh/DogWater?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "3",
			name: "ACME",
			url: "acme",
			type: "team",
			avatar: "https://avatar.vercel.sh/ACME?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "4",
			name: "MentosArcher",
			url: "mentosarch",
			type: "team",
			avatar: "https://avatar.vercel.sh/MentosArcher?&s=160",
			avatarFallbackInitials: "AA",
		},
		{
			id: "5",
			name: "GlitterBot",
			url: "glitterbot",
			type: "team",
			avatar: "https://avatar.vercel.sh/GlitterBot?&s=160",
			avatarFallbackInitials: "AA",
		},
	],
	selectedTeam: {
		id: "1",
		name: "Awari Industries",
		url: "awariinc",
		type: "team",
		avatar: "https://avatar.vercel.sh/Awari?&s=160",
		avatarFallbackInitials: "AA",
	},
	updateSelectedTeam: (team) => set(() => ({ selectedTeam: team })),
}));
