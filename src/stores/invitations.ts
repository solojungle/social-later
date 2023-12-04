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
		set((state) => {
			const existingIndex = state.invitations.findIndex(
				(inv) => inv.email === invitation.email,
			);

			// Overwrite the role to be capitalized, make the text lowercase first
			const lowerCaseRole = invitation.role.toLowerCase();
			const capitalizedRole =
				lowerCaseRole.charAt(0).toUpperCase() + lowerCaseRole.slice(1);

			const updatedInvitation = {
				...invitation,
				role: capitalizedRole,
			};

			if (existingIndex !== -1) {
				// If the invitation with the same email exists, overwrite it
				const updatedInvitations = [...state.invitations];
				updatedInvitations[existingIndex] = updatedInvitation;
				return { invitations: updatedInvitations };
			}

			return { invitations: [...state.invitations, updatedInvitation] };
		}),
	removeInvitation: (invitation) =>
		set((state) => ({
			invitations: state.invitations.filter((inv) => inv.id !== invitation.id),
		})),
}));
