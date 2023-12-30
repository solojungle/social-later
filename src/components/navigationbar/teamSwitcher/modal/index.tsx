import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	TeamCreationSchema,
	TeamCreationSchemaValues,
} from "@/schemas/team-schema";
import { api } from "@/trpc/react";

type TeamSwitcherModalProps = {
	setShowNewTeamDialog: any;
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
}

function ProductsSelector({ products, field }: ProductsSelectorProps) {
	if (!products || products.length <= 0) {
		return (
			<div className="flex items-center justify-center p-5">
				<Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
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
							className="peer sr-only"
						/>
						<Label
							htmlFor={product.id}
							className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
						>
							<img
								alt={product.name}
								src={product.image}
								className="mb-3 h-7 w-7"
							/>
							<span className="mb-2">{product.name}</span>
							<span className="text-xs text-muted-foreground">
								{product.priceFormatted} per month
							</span>
						</Label>
					</div>
				))}
			</RadioGroup>
		</FormControl>
	);
}

export default function CreateTeamModal({
	setShowNewTeamDialog,
	onNext,
}: TeamSwitcherModalProps) {
	const products = api.products.getProducts.useQuery();

	const defaultValues: TeamCreationSchemaValues = {
		name: "",
		subscription: "",
	};

	const form = useForm<TeamCreationSchemaValues>({
		resolver: zodResolver(TeamCreationSchema),
		defaultValues,
	});

	async function onSubmit(data: TeamCreationSchemaValues) {
		const choosenSubscription = products.data?.find(
			(product) => product.stripePriceId === data.subscription,
		);

		const formData = {
			name: data.name,
			subscription: {
				id: choosenSubscription?.id,
				priceId: choosenSubscription?.stripePriceId,
				name: choosenSubscription?.name,
				image: choosenSubscription?.image,
				price: choosenSubscription?.price,
				priceFormatted: choosenSubscription?.priceFormatted,
				currency: choosenSubscription?.currency,
			},
		};

		onNext(formData);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Team name</FormLabel>
							<FormControl>
								<Input placeholder="Acme Inc." {...field} />
							</FormControl>
							<FormDescription>
								This is your team&apos;s display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="subscription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subscriptions</FormLabel>
							<ProductsSelector products={products.data ?? []} field={field} />
							<FormDescription>
								Creating a new team will not affect your Personal Account
								(Hobby) or any of its projects.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className="mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => setShowNewTeamDialog(false)}
					>
						Cancel
					</Button>
					<Button type="submit">Continue</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
