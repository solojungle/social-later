"use client";

import { PublicSocialProfilesSchemaValues } from "@/schemas/social-profiles-schema";
import { TeamSchemaValues } from "@/schemas/team-schema";
import {
  TeamMembersSchemaValues,
  UserSchemaValues,
} from "@/schemas/user-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function StoreInitializer({
  members,
  profiles,
  teams,
  user,
}: {
  members: TeamMembersSchemaValues[];
  profiles: PublicSocialProfilesSchemaValues[];
  teams: TeamSchemaValues[];
  user: UserSchemaValues;
}) {
  const isInitialized = useRef(false);

  const params = useParams();

  const { currentProfileId } = useSocialProfilesStore();

  useEffect(() => {
    if (!isInitialized.current) {
      useUserStore.setState(user);
      useSelectedTeamStore.setState(teams[0] || {});
      useTeamMembersStore.setState({ members });
      useSocialProfilesStore.setState({
        currentProfileId: currentProfileId || profiles[0]?.id,
        profiles,
        profileType: profiles.find((profile) => profile.id === currentProfileId)
          ?.type,
      });
      isInitialized.current = true;
    }
  }, [user, teams, params.id, profiles, members, currentProfileId]);

  return null;
}
