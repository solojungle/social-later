"use client";

import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface PaymentModalProps {
	onNext: any;
	onBack: any;
}

export function PaymentModal({ onNext, onBack }: PaymentModalProps) {
	return (
		<div className="space-y-4">
			<PaymentElement />
			<AddressElement options={{ mode: "billing" }} />
			<DialogFooter className="flex !justify-between">
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
