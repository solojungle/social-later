import { create } from "zustand";

import { TeamSchemaValues } from "@/schemas/team/team-schema";

interface TeamState {
	teams: TeamSchemaValues[];
}

interface TeamStore extends TeamState {
	addTeam: (team: TeamSchemaValues) => void;
}

const defaultValues = {
	teams: [],
};

export const useTeamStore = create<TeamStore>()((set) => ({
	...defaultValues,
	addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
}));
