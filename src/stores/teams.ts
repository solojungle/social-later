import { create } from "zustand";

import { teamDefaultValues, TeamSchemaValues } from "@/schemas/team-schema";

interface TeamState {
	teams: TeamSchemaValues[];
	selectedTeam: TeamSchemaValues;
}

interface TeamStore extends TeamState {
	updateSelectedTeam: (team: TeamState["selectedTeam"]) => void;
}

const defaultValues = {
	teams: [],
	selectedTeam: teamDefaultValues,
};

export const useTeamStore = create<TeamStore>()((set) => ({
	...defaultValues,
	updateSelectedTeam: (team) => set(() => ({ selectedTeam: team })),
}));
