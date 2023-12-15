/* eslint-disable indent */

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

import { env } from "@/env.mjs";
import { useMultiStepCheckout } from "@/hooks/multi-step-checkout";

import CreateTeamModal from "../modal";
import { PaymentModal } from "./payment";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function Checkout() {
	// Pass the pages to the multi-step checkout hook.

	const { currentStep, nextStep, returnStep, formData } =
		useMultiStepCheckout();

	// const createTeam = api.team.create.useMutation({
	// 	onSuccess: (data) => {
	// 		addTeam({
	// 			...data,
	// 			type: "team",
	// 			imageFallbackInitials: "",
	// 		});

	// 		toast({
	// 			title: `Successfully created your team!`,
	// 			description: `To view your new team, click on the team switcher.`,
	// 		});
	// 	},
	// });

	// async function onSubmit(data: TeamCreationSchemaValues) {
	// 	try {
	// 		setIsLoading(true);
	// 		// createTeam.mutate({
	// 		// 	name: data.name,
	// 		// });
	// 	} catch (error) {
	// 		toast({
	// 			title: "Uh oh! Something went wrong.",
	// 			description: "There was a problem with your request.",
	// 			variant: "destructive",
	// 		});

	// 		throw error;
	// 	} finally {
	// 		setIsLoading(false);
	// 		setShowNewTeamDialog(false);
	// 	}
	// }

	const options: StripeElementsOptions = {
		mode: "subscription",
		currency: "usd",
		amount: 99,
	};

	function renderCurrentStep() {
		switch (currentStep) {
			case 0:
				return (
					<CreateTeamModal
						key="0"
						setShowNewTeamDialog={undefined}
						onNext={nextStep}
						onBack={returnStep}
					/>
				);
			case 1:
				return <PaymentModal key="1" onNext={nextStep} onBack={returnStep} />;
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
