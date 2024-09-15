"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

import { env } from "@/env.mjs";
import { useSelectedTeamStore } from "@/stores/selected-team";

import { TeamPaymentMethodCard } from "../cards/teams/team-payment-method";
import { TeamPaymentMethodListView } from "../cards/teams/team-payment-method/listView";
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
	/** Okay wow, you can just do this... */
	const options: StripeElementsOptions = {
		mode: "setup",
		currency: "usd",
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<div className="hidden sm:flex">
				{!!teamId && <TeamPaymentMethodCard teamId={teamId} />}
			</div>
			<div className="sm:hidden">
				{!!teamId && <TeamPaymentMethodListView teamId={teamId} />}
			</div>
			<TeamPaymentPlanCard />
		</Elements>
	);
}

export function BillingForm() {
	const { id: teamId } = useSelectedTeamStore();

	return !!teamId && <Wrapper teamId={teamId} />;
}
