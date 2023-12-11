"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { env } from "@/env.mjs";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { TeamPaymentMethodCard } from "../cards/teams/team-payment-method";
import { TeamPaymentPlanCard } from "../cards/teams/team-plan";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/**
 * Why was it written this way?
 *
 * We want to do the following:
 * - Create a stripePromise (this only works when just above the rendering of the component)
 * - Get a clientSecret from Stripe's servers (this works, but Zustand doesn't give us teamId early enough)
 * 	and using persist from localStorage isn't available on the server, only client so same issue, also it errors alot.
 *
 * So we have to do the following:
 * - The stripePromise has to be created, from my understanding, right before use.
 * - Wait for Zustand to give us the teamId (SSR and Persist kinda suck with Zustand)
 * 	 SideNote: the reason persist sucks is we lose type safety and it might not work anyway with SSR
 */
function Wrapper({ teamId }: { teamId: string }) {
	const { data } = api.stripe.createSetupIntent.useQuery({
		id: teamId,
	});

	if (!data?.clientSecret) {
		return null;
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{ clientSecret: data?.clientSecret }}
		>
			{Boolean(teamId) && <TeamPaymentMethodCard id={teamId} />}
			<TeamPaymentPlanCard />
		</Elements>
	);
}

export function BillingForm() {
	const { id: teamId } = useSelectedTeamStore();

	return Boolean(teamId) && <Wrapper teamId={teamId} />;
}
