"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { env } from "@/env.mjs";
import { useSelectedTeamStore } from "@/stores/selected-team";

import { TeamPaymentMethodCard } from "../cards/teams/team-payment-method";
import { TeamPaymentPlanCard } from "../cards/teams/team-plan";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function BillingForm() {
	const { id: teamId } = useSelectedTeamStore();

	return (
		<Elements stripe={stripePromise}>
			{Boolean(teamId) && <TeamPaymentMethodCard id={teamId} />}
			<TeamPaymentPlanCard />
		</Elements>
	);
}
