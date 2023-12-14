"use client";

import {
	AddressElement,
	Elements,
	PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

import { env } from "@/env.mjs";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function Wrapper() {
	return (
		<div>
			<PaymentElement />
			<AddressElement options={{ mode: "billing" }} />
		</div>
	);
}

export function PaymentModal() {
	const options: StripeElementsOptions = {
		mode: "subscription",
		currency: "usd",
		amount: 99,
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<Wrapper />
		</Elements>
	);
}
