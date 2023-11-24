import { create } from "zustand";

import {
	TeamSchemaValues,
	teamStoreDefaultValues,
} from "@/schemas/team-schema";

interface TeamState {
	teams: TeamSchemaValues[];
	selectedTeam: TeamSchemaValues;
}

interface TeamStore extends TeamState {
	updateSelectedTeam: (team: TeamState["selectedTeam"]) => void;
}

const defaultValues = {
	teams: [],
	selectedTeam: teamStoreDefaultValues,
};

export const useTeamStore = create<TeamStore>()((set) => ({
	...defaultValues,
	updateSelectedTeam: (team) => set(() => ({ selectedTeam: team })),
}));
