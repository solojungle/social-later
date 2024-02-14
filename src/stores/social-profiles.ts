import { create } from "zustand";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";

interface SocialProfilesState {
	profiles: PublicSocialProfilesSchemaValues[];
	currentProfileId: string;
	setCurrentProfileId: (id: string) => void;
}

interface SocialProfilesStore extends SocialProfilesState {}

const defaultValues = {
	profiles: [],
	currentProfileId: "",
};

export const useSocialProfilesStore = create<SocialProfilesStore>()((set) => ({
	...defaultValues,
	setCurrentProfileId: (currentProfileId) => set(() => ({ currentProfileId })),
}));
