import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";

type SocialProfilesStore = {
	profiles: PublicSocialProfilesSchemaValues[];
	currentProfileId: string;
	setCurrentProfileId: (profile: string) => void;
};

const defaultValues = {
	profiles: [],
	currentProfileId: "",
};

// persist to local storage
export const useSocialProfilesStore = create<SocialProfilesStore>()(
	persist(
		(set) => ({
			...defaultValues,
			setCurrentProfileId: (profile: string) =>
				set({ currentProfileId: profile }),
		}),
		{
			name: "social-profiles-store",
			storage: createJSONStorage(() => localStorage),
			// Currently I havent had a problem with hydration, but if you do, you can uncomment the following line
			// skipHydration: true,
		},
	),
);
