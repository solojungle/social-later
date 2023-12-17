"use client";

import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PaymentModalProps {
	onBack: any;
	formData: any;
}

interface TotalAmountProps {
	plan: string;
	amount: number;
}

function TotalAmount({ amount, plan }: TotalAmountProps) {
	return (
		<div className="rounded-xl border bg-card p-3 text-sm text-card-foreground">
			<h2 className="mb-2 font-medium">Your subscription</h2>
			<div className="flex justify-between text-muted-foreground">
				<p>{plan}</p>
				<p>${amount} billed monthly</p>
			</div>
			<Separator className="my-4" />
			<div className="flex justify-between font-medium">
				<p>Due Today</p>
				<p>${amount}</p>
			</div>
		</div>
	);
}

export function PaymentModal({ onBack, formData }: PaymentModalProps) {
	return (
		<div className="max-h-[70vh] space-y-4 overflow-y-scroll px-5 pb-2">
			<TotalAmount
				amount={formData.subscription.price}
				plan={formData.subscription.name}
			/>
			<Separator className="my-4" />
			<AddressElement options={{ mode: "billing" }} />
			<Separator className="my-4" />
			<PaymentElement />
			<DialogFooter className="flex flex-row !justify-between">
				<Button type="button" variant="ghost">
					Cancel
				</Button>
				<div className="space-x-2">
					<Button type="button" variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button
						type="submit"
						onClick={() => {
							console.log("clicked");
						}}
					>
						Subscribe
					</Button>
				</div>
			</DialogFooter>
		</div>
	);
}
