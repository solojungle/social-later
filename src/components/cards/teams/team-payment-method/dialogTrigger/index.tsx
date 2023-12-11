import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";

export function AddPaymentDialogTrigger({ teamId }: { teamId: string }) {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState();
	const [loading, setLoading] = useState(false);

	const handleError = (error: any) => {
		setLoading(false);
		setErrorMessage(error.message);
	};

	const createSetupIntent = api.stripe.createSetupIntent.useMutation();

	const handleSubmit = async (event: any) => {
		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setLoading(true);

		// Reset the error message
		setErrorMessage(undefined);

		// Trigger form validation and wallet collection
		const { error: submitError } = await elements.submit();
		if (submitError) {
			handleError(submitError);
			return;
		}

		// Create the SetupIntent and obtain clientSecret
		const { clientSecret } = await createSetupIntent.mutateAsync({
			id: teamId,
		});

		if (!clientSecret) {
			handleError("No client secret returned from API");
			return;
		}

		// Confirm the SetupIntent using the details collected by the Payment Element
		const { error } = await stripe.confirmSetup({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `${window.location.origin}/teams/${teamId}/settings/billing`,
			},
		});

		if (error) {
			// This point is only reached if there's an immediate error when
			// confirming the setup. Show the error to your customer (for example, payment details incomplete)
			handleError(error);
		} else {
			// Your customer is redirected to your `return_url`. For some payment
			// methods like iDEAL, your customer is redirected to an intermediate
			// site first to authorize the payment, then redirected to the `return_url`.
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add new card</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<DialogHeader>
						<DialogTitle>Add a Payment Method</DialogTitle>
						<DialogDescription>
							Please enter your card information below.
						</DialogDescription>
					</DialogHeader>
					<PaymentElement />
					{errorMessage && (
						<p className="text-[0.8rem] font-medium text-destructive">
							{errorMessage}
						</p>
					)}
					<DialogFooter>
						<Button type="submit" disabled={!stripe || loading}>
							Submit
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
