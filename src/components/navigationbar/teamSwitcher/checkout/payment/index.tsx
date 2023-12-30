"use client";

import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

interface PaymentModalProps {
	onBack: any;
	formData: {
		name: string;
		subscription: {
			id: string;
			name: string;
			currency: string;
			price: number;
			priceFormatted: string;
			priceId: string;
		};
	};
}

interface TotalAmountProps {
	plan: string;
	amount: string;
}

function TotalAmount({ amount, plan }: TotalAmountProps) {
	return (
		<div className="rounded-xl border bg-card p-3 text-sm text-card-foreground">
			<h2 className="mb-2 font-medium">Your subscription</h2>
			<div className="flex justify-between text-muted-foreground">
				<p>{plan}</p>
				<p>{amount} billed monthly</p>
			</div>
			<Separator className="my-4" />
			<div className="flex justify-between font-medium">
				<p>Due Today</p>
				<p>{amount}</p>
			</div>
		</div>
	);
}

export function PaymentModal({ onBack, formData }: PaymentModalProps) {
	const [errorMessage, setErrorMessage] = useState();
	const [loading, setLoading] = useState(false);
	const { addTeam } = useTeamStore();
	const stripe = useStripe();
	const elements = useElements();

	const handleError = (error: any) => {
		setLoading(false);
		setErrorMessage(error.message);
	};

	const createTeam = api.team.create.useMutation({
		onSuccess: (data) => {
			addTeam({
				...data.team,
				type: "team",
				imageFallbackInitials: "",
			});

			toast.success("Successfully created your team!", {
				description: `To view your new team, click on the team switcher.`,
			});
		},
	});

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

		try {
			const resp = await createTeam.mutateAsync({
				name: formData.name,
				internalProductId: formData.subscription.id,
				stripePriceId: formData.subscription.priceId,
			});

			const { error } = await stripe.confirmPayment({
				elements,
				clientSecret: resp.clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/teams/${resp.team.url}/settings/billing`,
				},
			});

			if (error) {
				handleError(error);
			}
		} catch (error) {
			toast.error("Uh oh! Something went wrong.", {
				description: "There was a problem with your request.",
			});

			handleError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-h-[70vh] space-y-4 overflow-y-scroll px-5 pb-2"
		>
			<TotalAmount
				amount={formData.subscription.priceFormatted}
				plan={formData.subscription.name}
			/>
			<Separator className="my-4" />
			<PaymentElement />
			{errorMessage && (
				<p className="text-[0.8rem] font-medium text-destructive">
					{errorMessage}
				</p>
			)}
			<DialogFooter className="flex flex-row !justify-between">
				<Button type="button" variant="ghost">
					Cancel
				</Button>
				<div className="space-x-2">
					<Button type="button" variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button type="submit" disabled={!stripe || loading}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Subscribe
					</Button>
				</div>
			</DialogFooter>
		</form>
	);
}
