"use client";

import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { SettingsCardBase } from "../settings-card-base";

interface TeamPaymentMethodProps {
	formControl: Control<any, any>;
}

const data = [
	{
		brand: "Visa",
		default: false,
		type: "Credit",
		last4: "1234",
		expires: "8/2025",
	},
	{
		brand: "Mastercard",
		default: true,
		type: "Debit",
		last4: "4567",
		expires: "8/2028",
	},
	{
		brand: "Discover",
		default: false,
		type: "Prepaid",
		last4: "8910",
		expires: "8/2025",
	},
];

export function TeamPaymentMethodCard({ formControl }: TeamPaymentMethodProps) {
	if (data.length < 1) {
		return (
			<SettingsCardBase
				title="Payment Method"
				content={
					<span className="text-sm">
						You have not yet added any cards. Click the button below to add one.
					</span>
				}
				footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
				buttonContent="Add new card"
			/>
		);
	}

	return (
		<SettingsCardBase
			title="Payment Method"
			description="Your charges will be deducted from the default card shown below. This can be changed by adding a new card and making it the default using the menu on the right."
			content={
				<Table>
					<TableHeader>
						<TableRow className="text-xs uppercase">
							<TableHead>Brand</TableHead>
							<TableHead>Default</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Number (last 4)</TableHead>
							<TableHead>Exp. Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((card) => (
							<TableRow key={card.brand}>
								<TableCell>{card.brand}</TableCell>
								<TableCell>
									{card.default === true && <CheckCircle2 />}
								</TableCell>
								<TableCell>{card.type}</TableCell>
								<TableCell>{card.last4}</TableCell>
								<TableCell>{card.expires}</TableCell>
								<TableCell className="w-[0]">
									<Button size="icon" variant="outline">
										<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			}
			footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
			buttonContent="Add new card"
		/>
	);
}
