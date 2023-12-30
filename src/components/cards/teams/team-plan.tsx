"use client";

import { Separator } from "@radix-ui/react-separator";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

export function TeamPaymentPlanCard() {
	const { id: teamId } = useSelectedTeamStore();

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
					Your team is on the {resp?.productName} subscription. The next payment
					of ${resp?.price} will occur on {currentPeriodEnd}.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between">
				<div className="flex w-full flex-col space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Current billing cycle ({currentPeriodStart} - {currentPeriodEnd}).
						</span>
						<div>
							<Button variant="outline">Update Plan</Button>
						</div>
					</div>
					{/* <Table>
						<TableHeader>
							<TableRow className="text-xs uppercase">
								<TableHead>Item</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Unit Price</TableHead>
								<TableHead className="text-right">Price</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((card) => (
								<TableRow key={card.item}>
									<TableCell>{card.item}</TableCell>
									<TableCell>{card.quantity}</TableCell>
									<TableCell>{card.unitPrice}</TableCell>
									<TableCell className="text-right">{card.price}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>Total</TableCell>
								<TableCell className="text-right">$2,500.00</TableCell>
							</TableRow>
						</TableFooter>
					</Table> */}
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
