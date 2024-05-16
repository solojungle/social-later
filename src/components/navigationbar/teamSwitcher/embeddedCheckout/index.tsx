/* eslint-disable indent */

"use client";

import { EmbeddedStripePayments } from "@/components/embeddedStripePayments";
import { useMultiStepEmbeddedCheckout } from "@/hooks/multi-step-checkout";

import { PlanSelection } from "./planSelection";

type EmbeddedCheckoutProps = {
	setDialog: (value: boolean) => void;
};

export function EmbeddedCheckout({ setDialog }: EmbeddedCheckoutProps) {
	// Pass the pages to the multi-step checkout hook.
	const { currentStep, nextStep, returnStep, clientSecret } =
		useMultiStepEmbeddedCheckout();

	function renderCurrentStep() {
		switch (currentStep) {
			case 0:
				return (
					<PlanSelection
						key="0"
						setDialog={setDialog}
						onNext={nextStep}
						onBack={returnStep}
					/>
				);
			case 1:
				return (
					<EmbeddedStripePayments
						key="1"
						onBack={returnStep}
						clientSecret={clientSecret}
					/>
				);
			default:
				return null;
		}
	}

	return renderCurrentStep();
}
