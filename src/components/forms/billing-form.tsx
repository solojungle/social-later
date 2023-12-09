"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";

import { TeamPaymentMethodCard } from "../cards/teams/team-payment-method";
import { TeamPaymentPlanCard } from "../cards/teams/team-plan";

export function BillingForm() {
	const { id: teamId } = useSelectedTeamStore();

	return (
		<>
			{Boolean(teamId) && <TeamPaymentMethodCard id={teamId} />}
			<TeamPaymentPlanCard />
		</>
	);
}
