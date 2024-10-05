import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";

type SocialProfilesStore = {
	profiles: PublicSocialProfilesSchemaValues[];
	currentProfileId: string;
	setCurrentProfile: (profile: PublicSocialProfilesSchemaValues) => void;
	profileType: string | undefined;
};

const defaultValues = {
	profiles: [],
	currentProfileId: "",
	profileType: undefined,
};

// persist to local storage
export const useSocialProfilesStore = create<SocialProfilesStore>()(
	persist(
		(set) => ({
			...defaultValues,
			setCurrentProfile: (profile: PublicSocialProfilesSchemaValues) =>
				set({ currentProfileId: profile.id, profileType: profile.type }),
		}),
		{
			name: "social-profiles-store",
			storage: createJSONStorage(() => localStorage),
			// Currently I havent had a problem with hydration, but if you do, you can uncomment the following line
			// skipHydration: true,
		},
	),
);
