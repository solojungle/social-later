import { create } from "zustand";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";

interface SocialProfilesState {
	profiles: PublicSocialProfilesSchemaValues[];
}

interface SocialProfilesStore extends SocialProfilesState {}

const defaultValues = {
	profiles: [],
};

export const useSocialProfilesStore = create<SocialProfilesStore>(() => ({
	...defaultValues,
}));
