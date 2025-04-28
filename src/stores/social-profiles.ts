import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SocialProfilesStore = {
  currentProfileId: string;
  profiles: PublicSocialProfilesSchemaValues[];
  profileType: string | undefined;
  setCurrentProfile: (profile: PublicSocialProfilesSchemaValues) => void;
};

const defaultValues = {
  currentProfileId: "",
  profiles: [],
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
