"use client";

import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PaymentModalProps {
	onNext: any;
	onBack: any;
}

function TotalAmount() {
	return (
		<div className="rounded-xl border bg-card p-3 text-sm text-card-foreground">
			<h2 className="mb-2 font-medium">Your subscription</h2>
			<div className="flex justify-between text-muted-foreground">
				<p>Premium Plan</p>
				<p>$15.00 billed monthly</p>
			</div>
			<Separator className="my-4" />
			<div className="flex justify-between font-medium">
				<p>Total</p>
				<p>$15.00</p>
			</div>
		</div>
	);
}

export function PaymentModal({ onNext, onBack }: PaymentModalProps) {
	return (
		<div className="max-h-[70vh] space-y-4 overflow-y-scroll px-5">
			<TotalAmount />
			<AddressElement options={{ mode: "billing" }} />
			<PaymentElement />
			<DialogFooter className="flex flex-row !justify-between">
				<Button type="button" variant="ghost">
					Cancel
				</Button>
				<div className="space-x-2">
					<Button type="button" variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button type="submit" onClick={onNext}>
						Subscribe
					</Button>
				</div>
			</DialogFooter>
		</div>
	);
}
