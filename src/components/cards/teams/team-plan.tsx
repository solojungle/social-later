import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { SettingsCardBase } from "../settings-card-base";

const data = [
	{
		item: "Team Seats",
		quantity: 34,
		unitPrice: 20,
		price: "$680",
	},
	{
		item: "Channels",
		quantity: 3,
		unitPrice: 20,
		price: "$60",
	},
];

export function TeamPaymentPlanCard() {
	return (
		<SettingsCardBase
			title="Plan"
			description="Your team is on the Pro plan. The next payment of $800 will occur on December 2, 2023."
			footerSubtitle="Your plan includes a limited amount of free usage. If the usage on your projects exceeds the allotted limit, you will need to upgrade to a Pro team."
			content={
				<div className="flex w-full flex-col space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Current billing cycle (Nov 2 - Dec 2).
						</span>
						<div>
							<Button variant="outline">Update Plan</Button>
						</div>
					</div>
					<Table>
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
					</Table>
				</div>
			}
		/>
	);
}
