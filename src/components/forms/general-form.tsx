"use client";

import { TeamNameCard } from "@/components/cards/teams/team-name";
import { TeamUrlCard } from "@/components/cards/teams/team-url";

import { TeamLeaveCard } from "../cards/teams/team-leave";

export function GeneralTeamForm() {
	return (
		<>
			<TeamNameCard />
			<TeamUrlCard />
			{/* <TeamAvatarCard /> */}
			<TeamLeaveCard />
		</>
	);
}
