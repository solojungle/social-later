import { useSession } from "next-auth/react";

import { TeamDeleteCard } from "@/components/cards/teams/team-delete";
import { TeamLeaveCard } from "@/components/cards/teams/team-leave";
import { TeamNameCard } from "@/components/cards/teams/team-name";
import { TeamUrlCard } from "@/components/cards/teams/team-url";
import { useTeamMembersStore } from "@/stores/team-members";

export function GeneralTeamForm() {
	const { members } = useTeamMembersStore();

	const { data: session } = useSession();

	return (
		<>
			<TeamNameCard />
			<TeamUrlCard />
			{/* <TeamAvatarCard /> */}
			{members.length > 1 && <TeamLeaveCard />}
			{session?.user?.role === "OWNER" && <TeamDeleteCard />}
		</>
	);
}
