import { CardCvcElement } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function AddPaymentDialogTrigger() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add new card</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a Card</DialogTitle>
					<DialogDescription>Add a payment method</DialogDescription>
					<CardCvcElement />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
