import { CheckCircle2 } from "lucide-react";

import { getPaymentMethodIcon } from "@/components/ccicon";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { InterfaceIcons } from "@/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";

import { OptionsMenu } from "..";
import { AddPaymentDialogTrigger } from "../dialogTrigger";

export function TeamPaymentMethodListView({ teamId }: any) {
	const { data, isLoading, isFetching } = api.stripe.getPaymentMethods.useQuery(
		{
			id: teamId,
		},
	);

	if (isLoading || isFetching) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Payment Method</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex w-full flex-col items-center justify-center">
						<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
						<span className="mt-4 text-xs text-muted-foreground">
							Loading payment methods...
						</span>
					</div>
				</CardContent>
				<CardFooter>
					<p className="text-xs text-muted-foreground">
						At most, three credit cards, debit cards or prepaid cards can be
						added.
					</p>
				</CardFooter>
			</Card>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Payment Method</CardTitle>
				</CardHeader>
				<CardContent>
					<span className="text-sm">
						You have not yet added any cards. Click the button below to add one.
					</span>
				</CardContent>
				<CardFooter className="flex flex-col items-start gap-4">
					<p className="text-xs text-muted-foreground">
						At most, three credit cards, debit cards or prepaid cards can be
						added.
					</p>
					<AddPaymentDialogTrigger teamId={teamId} />
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment Method</CardTitle>
				<p className="text-sm text-muted-foreground">
					Your charges will be deducted from the default card shown below. This
					can be changed by adding a new card and making it the default using
					the menu on each card.
				</p>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{data.map((card) => (
						<div
							key={card.id}
							className="relative rounded-lg  border border-border p-3 text-xs"
						>
							<div className="flex flex-row items-center justify-between pb-2">
								<div className="flex items-center gap-2">
									{getPaymentMethodIcon(card.brand ?? "")}
									<span className="font-semibold capitalize">{card.brand}</span>
								</div>
								{card.isDefault && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<CheckCircle2 className="size-5" />
											</TooltipTrigger>
											<TooltipContent
												sideOffset={10}
												collisionPadding={{
													top: 1,
													right: 1,
													bottom: 1,
													left: 1,
												}}
											>
												Default payment method
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
							<div className="grid grid-cols-2 grid-rows-3 gap-2">
								<p className="font-semibold">Type</p>
								<p className="capitalize">{card.type}</p>
								<p className="font-semibold">Number</p>
								<p>•••• {card.last4}</p>
								<p className="font-semibold">Exp. Date</p>
								<p>{`${card.expMonth}/${card.expYear}`}</p>
							</div>
							<div className="flex w-full justify-end">
								<OptionsMenu
									className="size-8"
									isDefault={card.isDefault}
									isLastPaymentMethod={data.length === 1}
									teamId={teamId}
									paymentMethodId={card.id}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
			<CardFooter className="grid grid-cols-2 gap-2">
				<p className="text-xs text-muted-foreground">
					At most, three credit cards, debit cards or prepaid cards can be
					added.
				</p>
				<AddPaymentDialogTrigger teamId={teamId} />
			</CardFooter>
		</Card>
	);
}
