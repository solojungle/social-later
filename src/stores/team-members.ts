import { create } from "zustand";

import { TeamMembersSchemaValues } from "@/schemas/user/user-schema";

interface TeamMembersState {
	members: TeamMembersSchemaValues[];
}

interface TeamMembersStore extends TeamMembersState {}

const defaultValues = {
	members: [],
};

export const useTeamMembersStore = create<TeamMembersStore>()((set) => ({
	...defaultValues,
}));
