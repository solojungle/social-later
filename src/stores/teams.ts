import { create } from "zustand";

import { TeamSchemaValues } from "@/schemas/team/team-schema";

interface TeamState {
	teams: TeamSchemaValues[];
}

interface TeamStore extends TeamState {
	addTeam: (team: TeamSchemaValues) => void;
	updateTeamName: (teamId: string, name: string) => void;
	updateTeamUrl: (teamId: string, url: string) => void;
}

const defaultValues = {
	teams: [],
};

export const useTeamStore = create<TeamStore>()((set) => ({
	...defaultValues,
	addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
	updateTeamName: (teamId, name) =>
		set((state) => ({
			teams: state.teams.map((team) =>
				team.id === teamId ? { ...team, name } : team,
			),
		})),
	updateTeamUrl: (teamId, url) =>
		set((state) => ({
			teams: state.teams.map((team) =>
				team.id === teamId ? { ...team, url } : team,
			),
		})),
}));
