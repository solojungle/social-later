import { create } from "zustand";

import { InvitationSchemaValues } from "@/schemas/invitation/invitation-schema";

interface InvitationState {
	invitations: InvitationSchemaValues[];
}

interface InvitationsStore extends InvitationState {}

const defaultValues = {
	invitations: [],
};

export const useTeamMembersStore = create<InvitationsStore>()((set) => ({
	...defaultValues,
}));
