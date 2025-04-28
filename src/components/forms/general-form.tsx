import { TeamLeaveCard } from "@/components/cards/teams/team-leave";
import { TeamNameCard } from "@/components/cards/teams/team-name";
import { TeamUrlCard } from "@/components/cards/teams/team-url";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import { UserRole } from "@prisma/client";

import { TeamDeleteCard } from "../cards/teams/team-delete";

export function GeneralTeamForm() {
  const { members } = useTeamMembersStore();
  const { id: userId } = useUserStore();

  const userRole = members.find((member) => member.id === userId)?.role;

  return (
    <>
      <TeamNameCard />
      <TeamUrlCard />
      {/* <TeamAvatarCard /> */}
      {members.length > 1 && <TeamLeaveCard />}
      {userRole === UserRole.OWNER && <TeamDeleteCard />}
    </>
  );
}
