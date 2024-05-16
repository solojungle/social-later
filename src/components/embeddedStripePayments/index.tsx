"use client";

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { env } from "@/env.mjs";

import { Button } from "../ui/button";

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type EmbeddedCheckoutProps = {
	clientSecret: string;
	onBack: () => void;
};

export function EmbeddedStripePayments({
	clientSecret,
	onBack,
}: EmbeddedCheckoutProps) {
	return (
		<>
			<div className="flex flex-row space-x-4">
				<Button type="button" variant="outline" onClick={onBack}>
					Back
				</Button>
			</div>
			<EmbeddedCheckoutProvider
				stripe={stripePromise}
				options={{ clientSecret }}
			>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</>
	);
}
