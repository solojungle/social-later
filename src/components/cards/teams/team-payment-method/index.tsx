"use client";

import { CheckCircle2, InfoIcon, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InterfaceIcons } from "@/components/ui/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";

import { SettingsCardBase } from "../../settings-card-base";
import { AddPaymentDialogTrigger } from "./dialogTrigger";

interface TeamPaymentMethodCardProps {
	id: string;
}

function OptionsMenu({
	isDefault,
	isLastPaymentMethod,
}: {
	isDefault?: boolean;
	isLastPaymentMethod?: boolean;
}) {
	const isDisabled = isDefault && isLastPaymentMethod;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isDisabled}>
				<Button size="icon" variant="outline">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem disabled={isDefault}>Set as default</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={isLastPaymentMethod}
					className="text-destructive"
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function TeamPaymentMethodCard({ id }: TeamPaymentMethodCardProps) {
	const { data, isLoading, isFetching } = api.stripe.getPaymentMethods.useQuery(
		{
			id,
		},
	);

	if (isLoading || isFetching) {
		return (
			<SettingsCardBase
				title="Payment Method"
				content={
					<div className="flex w-full flex-col items-center justify-center">
						<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
						<span className="mt-4 text-xs text-muted-foreground">
							Loading payment methods...
						</span>
					</div>
				}
				footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
			/>
		);
	}

	if (!data || data.length === 0) {
		return (
			<SettingsCardBase
				title="Payment Method"
				content={
					<span className="text-sm">
						You have not yet added any cards. Click the button below to add one.
					</span>
				}
				footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
				button={<AddPaymentDialogTrigger teamId={id} />}
			/>
		);
	}

	return (
		<SettingsCardBase
			title="Payment Method"
			description="Your charges will be deducted from the default card shown below. This can be changed by adding a new card and making it the default using the menu on the right."
			content={
				<TooltipProvider>
					<Table>
						<TableHeader>
							<TableRow className="text-xs uppercase">
								<TableHead>Brand</TableHead>
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<TableHead className="flex items-center gap-1 uppercase">
											Default
											<InfoIcon className="h-3 w-3" />
										</TableHead>
									</TooltipTrigger>
									<TooltipContent
										className="normal-case"
										collisionPadding={{
											top: 5,
											right: 5,
											bottom: 5,
											left: 5,
										}}
									>
										The card that is used to pay for a subscription
									</TooltipContent>
								</Tooltip>
								<TableHead>Type</TableHead>
								<TableHead>Number (last 4)</TableHead>
								<TableHead>Exp. Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((card) => (
								<TableRow key={card.id}>
									<TableCell className="capitalize">{card.brand}</TableCell>
									<TableCell>{card.isDefault && <CheckCircle2 />}</TableCell>
									<TableCell className="capitalize">{card.type}</TableCell>
									<TableCell>•••• {card.last4}</TableCell>
									<TableCell>{`${card.expMonth}/${card.expYear}`}</TableCell>
									<TableCell className="w-[0]">
										<OptionsMenu
											isDefault={card.isDefault}
											isLastPaymentMethod={data.length === 1}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TooltipProvider>
			}
			footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
			button={<AddPaymentDialogTrigger teamId={id} />}
		/>
	);
}
