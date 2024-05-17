"use client";

import { CheckCircle2, Loader2, XCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

type SuccessPageContentProps = {
	customer: string;
	subscription: string;
	product: string;
};

function SuccessPageContent({
	customer,
	subscription,
	product,
}: SuccessPageContentProps) {
	const hasCreatedTeam = useRef(false);
	const { addTeam } = useTeamStore();
	const router = useRouter();

	const {
		mutateAsync: createTeamViaEmbed,
		isLoading,
		isError,
	} = api.team.createViaEmbed.useMutation({
		onSuccess: (data: any) => {
			addTeam({
				...data.team,
			});

			router.push("/publish");
		},
	});

	useEffect(() => {
		if (!hasCreatedTeam.current) {
			createTeamViaEmbed({
				customer,
				subscription,
				product,
			});
			hasCreatedTeam.current = true;
		}
	}, [customer, subscription, product, createTeamViaEmbed]);

	return (
		<div className="flex h-screen flex-col items-center  justify-center text-center text-lg">
			<CheckCircle2 className="mb-6 h-16 w-16 text-green-500" />
			<h1>Thank you for your purchase!</h1>
			<div>{isLoading ? <p>Creating your team...</p> : null}</div>
			<div>
				{isError ? <p>Failed to create team, please contact support!</p> : null}
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
			product={checkout.product}
		/>
	);
}
