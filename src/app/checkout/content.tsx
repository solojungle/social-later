"use client";

import { CheckCircle2, Loader2, XCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

type SuccessPageContentProps = {
	customer: string;
	subscription: string;
};

function SuccessPageContent({
	customer,
	subscription,
}: SuccessPageContentProps) {
	const { addTeam } = useTeamStore();

	const [countdown, setCountdown] = useState(3);

	const {
		mutateAsync: createTeam,
		isLoading,
		isError,
		isSuccess,
	} = api.team.createViaEmbed.useMutation({
		onSuccess: (data: any) => {
			addTeam({
				...data.team,
			});

			// Set a timer to redirect to the publish page
			const timer = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);

			setTimeout(() => {
				clearInterval(timer);
				window.location.href = `/teams/${data.team.id}/publish`;
			}, 3000);
		},
	});

	useEffect(() => {
		if (customer && subscription && !isLoading && !isSuccess && !isError) {
			createTeam({
				customer,
				subscription,
			});
		}
	}, [createTeam, customer, isError, isLoading, isSuccess, subscription]);

	return (
		<div className="flex h-screen flex-col items-center  justify-center text-center text-lg">
			<CheckCircle2 className="mb-6 h-16 w-16 text-green-500" />
			<h1>Thank you for your purchase!</h1>
			<div>{isLoading ? <p>Creating team...</p> : null}</div>
			<div>
				{isError ? <p>Failed to create team, please contact support!</p> : null}
			</div>
			<div>
				{isSuccess ? (
					<p>
						Team created successfully! Redirecting you to the publish page in{" "}
						{countdown} seconds.
					</p>
				) : null}
			</div>
		</div>
	);
}

function ErrorPageContent() {
	return (
		<div className="flex h-screen flex-col items-center justify-center text-center text-lg">
			<XCircleIcon className="mb-6 h-16 w-16 text-red-500" />
			<h1>Something went wrong</h1>
			<p>Sorry, we could not process your payment. Please try again.</p>
		</div>
	);
}

export function CheckoutPageContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("sessionId");

	if (!sessionId) {
		return <ErrorPageContent />;
	}

	const {
		data: checkout,
		isFetching,
		isError,
	} = api.stripe.getCheckoutSessionStatus.useQuery(
		{
			sessionId,
		},
		{
			enabled: !!sessionId,
		},
	);

	if (isFetching) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<Loader2 className="mb-6 h-16 w-16 animate-spin text-muted-foreground" />
				<h1 className="text-center text-lg font-extralight text-muted-foreground">
					Getting payment status...
				</h1>
			</div>
		);
	}

	if (isError || !checkout || !checkout.customer || !checkout.subscription) {
		return <ErrorPageContent />;
	}

	return (
		<SuccessPageContent
			customer={checkout.customer}
			subscription={checkout.subscription}
		/>
	);
}
