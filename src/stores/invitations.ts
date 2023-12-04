import { create } from "zustand";

import { AlternativeInvitationSchemaValues } from "@/schemas/invitation/invitation-schema";

interface InvitationState {
	invitations: AlternativeInvitationSchemaValues[];
}

interface InvitationsStore extends InvitationState {
	addInvitation: (invitation: AlternativeInvitationSchemaValues) => void;
	removeInvitation: (invitation: AlternativeInvitationSchemaValues) => void;
}

const defaultValues = {
	invitations: [],
};

export const useInvitationsStore = create<InvitationsStore>()((set) => ({
	...defaultValues,
	addInvitation: (invitation) =>
		set((state) => ({ invitations: [...state.invitations, invitation] })),
	removeInvitation: (invitation) =>
		set((state) => ({
			invitations: state.invitations.filter((inv) => inv.id !== invitation.id),
		})),
}));
