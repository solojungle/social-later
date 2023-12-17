import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlaneIcon } from "lucide-react";
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
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
	products: any[];
	field: any;
}

function ProductsSelector({ products, field }: ProductsSelectorProps) {
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
							value={product.id}
							id={product.id}
							className="peer sr-only"
						/>
						<Label
							htmlFor={product.id}
							className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
						>
							<PlaneIcon className="mb-3 h-7 w-7" />
							<span className="mb-2">{product.name}</span>
							<span className="text-xs text-muted-foreground">
								${product.default_price.unit_amount / 100} per month
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
	onBack,
}: TeamSwitcherModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const products = api.stripe.getProducts.useQuery();

	console.log(products.data);

	const defaultValues: TeamCreationSchemaValues = {
		name: "",
		subscription: "",
	};

	const form = useForm<TeamCreationSchemaValues>({
		resolver: zodResolver(TeamCreationSchema),
		defaultValues,
	});

	async function onSubmit(data: TeamCreationSchemaValues) {
		// onClick={onNext}
		console.log(data);
		onNext();
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
							<FormLabel>Subscription</FormLabel>
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
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Continue
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
