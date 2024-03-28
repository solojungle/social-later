import { TeamDeleteCard } from "@/components/cards/teams/team-delete";
import { TeamLeaveCard } from "@/components/cards/teams/team-leave";
import { TeamNameCard } from "@/components/cards/teams/team-name";
import { TeamUrlCard } from "@/components/cards/teams/team-url";

export function GeneralTeamForm() {
	return (
		<>
			<TeamNameCard />
			<TeamUrlCard />
			{/* <TeamAvatarCard /> */}
			<TeamLeaveCard />
			<TeamDeleteCard />
		</>
	);
}
