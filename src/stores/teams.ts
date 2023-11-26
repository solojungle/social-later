import { create } from "zustand";

import { TeamSchemaValues } from "@/schemas/team/team-schema";

interface TeamState {
	teams: TeamSchemaValues[];
}

interface TeamStore extends TeamState {}

const defaultValues = {
	teams: [],
};

export const useTeamStore = create<TeamStore>()((set) => ({
	...defaultValues,
}));
