import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { InterfaceIcons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";

type TeamSwitcherModalProps = {
	setDialog: any;
	onNext: any;
	onBack: any;
};

interface ProductsSelectorProps {
	products: {
		id: string;
		name: string;
		image: string;
		price: number;
		priceFormatted: string;
		currency: string;
		description: string | null;
		stripeProductId: string;
		stripePriceId: string;
	}[];
	field: any;
	disabledProduct?: string[];
}

export function ProductsSelector({
	products,
	field,
	disabledProduct,
}: ProductsSelectorProps) {
	if (!products || products.length <= 0) {
		return (
			<div className="flex items-center justify-center p-5">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<FormControl>
			<RadioGroup
				className="grid grid-cols-2 gap-4"
				onValueChange={field.onChange}
				defaultValue={field.value}
			>
				{products.map((product) => (
					<div key={product.id}>
						<RadioGroupItem
							value={product.stripePriceId}
							id={product.id}
							disabled={disabledProduct?.includes(product.stripeProductId)}
							className="peer sr-only"
						/>
						<Label
							htmlFor={product.id}
							className="flex h-32 cursor-pointer flex-col items-center rounded-md border-2 border-muted bg-popover p-4 ring-primary/40 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-2"
						>
							<span className="mb-2 text-lg">{product.name}</span>
							<span className="text-sm text-muted-foreground">
								{product.priceFormatted} per month
							</span>
						</Label>
					</div>
				))}
			</RadioGroup>
		</FormControl>
	);
}

const TeamCreationSchema = z.object({
	subscription: z.string().min(1, {
		message: "You must pick at least one option.",
	}),
});

type TeamCreationSchemaValues = z.infer<typeof TeamCreationSchema>;

export function PlanSelection({ setDialog, onNext }: TeamSwitcherModalProps) {
	const products = api.products.getProducts.useQuery();

	const [loading, setLoading] = useState(false);

	const { mutateAsync: getClientSecret } =
		api.stripe.createCheckoutSession.useMutation({
			onSettled: () => setLoading(false),
		});

	const defaultValues: TeamCreationSchemaValues = {
		subscription: "",
	};

	const form = useForm<TeamCreationSchemaValues>({
		resolver: zodResolver(TeamCreationSchema),
		defaultValues,
	});

	async function onSubmit(data: TeamCreationSchemaValues) {
		setLoading(true);

		const choosenSubscription = products.data?.find(
			(product) => product.stripePriceId === data.subscription,
		);

		// Create the checkout session
		const secretObject = await getClientSecret({
			priceId: choosenSubscription?.stripePriceId,
		});

		// Convert clientSecret to string instead of an object
		const { clientSecret } = secretObject;

		onNext(clientSecret);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="subscription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subscriptions</FormLabel>
							<ProductsSelector products={products.data ?? []} field={field} />
							<FormDescription>
								Creating a new team will not affect your other teams or any of
								its projects.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className="mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => setDialog(false)}
					>
						Cancel
					</Button>
					<Button disabled={loading} type="submit">
						{loading && (
							<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
						)}
						Continue
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
