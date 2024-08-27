"use client";

import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

// const data = [
// 	{
// 		item: "Team Seats",
// 		quantity: 34,
// 		unitPrice: 20,
// 		price: "$680",
// 	},
// 	{
// 		item: "Channels",
// 		quantity: 3,
// 		unitPrice: 20,
// 		price: "$60",
// 	},
// ];

export function getCurrentDate(time: number) {
	const newDate = new Date(time);

	// Use toLocaleString with options to get the abbreviated month name and two-digit day
	const formattedDate = newDate.toLocaleString("en-US", {
		month: "short",
		day: "2-digit",
	});

	return formattedDate;
}

function PausePlanButton() {
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const { mutateAsync: cancelSubscription } =
		api.stripe.cancelSubscription.useMutation();

	return (
		<AlertDialog open={show} onOpenChange={setShow}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Pause Plan</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to pause your plan?
					</AlertDialogTitle>
					<AlertDialogDescription>
						You will not be able to use the features of the plan until you
						resume it.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						disabled={loading}
						variant="destructive"
						onClick={() => {
							setLoading(true);
							// cancelSubscription({});
							setLoading(false);

							setShow(false);
							toast.success("Your plan has been paused.");
						}}
					>
						{loading && (
							<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
						)}
						Pause
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function TeamPaymentPlanCard() {
	const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();

	const { data: resp } = api.stripe.getSubscription.useQuery({
		id: teamId,
	});

	if (!resp || !resp?.currentPeriodEnd) {
		return null;
	}

	const currentPeriodEnd = getCurrentDate(resp.currentPeriodEnd * 1000);
	const currentPeriodStart = getCurrentDate(resp.currentPeriodStart * 1000);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="mb-2">Plan</CardTitle>
				<CardDescription>
					Your team is on the {resp.productName} subscription. The next payment
					of {resp.priceFormatted} will occur on {currentPeriodEnd}.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between">
				<div className="flex w-full flex-col space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Current billing cycle ({currentPeriodStart} - {currentPeriodEnd}).
						</span>
						<div className="space-x-1">
							<Button variant="outline">Update Plan</Button>
							{stripeSubscriptionStatus === "active" && <PausePlanButton />}
						</div>
					</div>
				</div>
			</CardContent>
			<div className="rounded-b-xl bg-muted">
				<Separator className="my-2" />
				<CardFooter className="flex justify-between p-4">
					<span className="text-sm text-muted-foreground">
						Your plan includes a limited amount of free usage. If the usage on
						your projects exceeds the allotted limit, you will need to upgrade.
					</span>
				</CardFooter>
			</div>
		</Card>
	);
}
