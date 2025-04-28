import { TeamMembersSchemaValues } from "@/schemas/user-schema";
import { create } from "zustand";

interface TeamMembersState {
  members: TeamMembersSchemaValues[];
}

interface TeamMembersStore extends TeamMembersState {}

const defaultValues = {
  members: [],
};

export const useTeamMembersStore = create<TeamMembersStore>()(() => ({
  ...defaultValues,
}));
