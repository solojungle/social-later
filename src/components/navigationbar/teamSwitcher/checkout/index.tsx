/* eslint-disable indent */

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

import { env } from "@/env.mjs";
import { useMultiStepCheckout } from "@/hooks/multi-step-checkout";

import CreateTeamModal from "../modal";
import { PaymentModal } from "./payment";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type CheckoutProps = {
	setDialog: any;
};

export function Checkout({ setDialog }: CheckoutProps) {
	// Pass the pages to the multi-step checkout hook.
	const { currentStep, nextStep, returnStep, formData } =
		useMultiStepCheckout();

	// This isn't really used, but it's required by Stripe.
	const options: StripeElementsOptions = {
		mode: "subscription",
		currency: "usd",
		amount: 0,
	};

	function renderCurrentStep() {
		switch (currentStep) {
			case 0:
				return (
					<CreateTeamModal
						key="0"
						setDialog={setDialog}
						onNext={nextStep}
						onBack={returnStep}
					/>
				);
			case 1:
				return (
					<PaymentModal
						key="1"
						onBack={returnStep}
						formData={formData}
						setDialog={setDialog}
					/>
				);
			default:
				return null;
		}
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			{renderCurrentStep()}
		</Elements>
	);
}
