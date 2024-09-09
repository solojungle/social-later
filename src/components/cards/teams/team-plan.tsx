"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProductsSelector } from "@/components/navigationbar/teamSwitcher/embeddedCheckout/planSelection";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

export function getCurrentDate(time: number) {
	const newDate = new Date(time);

	// Use toLocaleString with options to get the abbreviated month name and two-digit day
	const formattedDate = newDate.toLocaleString("en-US", {
		month: "short",
		day: "2-digit",
	});

	return formattedDate;
}

function PausePlanButton({ teamId }: { teamId: string }) {
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const utils = api.useUtils();

	if (!teamId) {
		return null;
	}

	// Canceling the subscription is better since it will not mess up the billing cycle/invoices etc.
	const { mutateAsync: cancelSubscription } =
		api.stripe.cancelSubscription.useMutation();

	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogTrigger asChild>
				<Button variant="destructive">Pause Plan</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure you want to pause your plan?</DialogTitle>
					<DialogDescription>
						You will not be able to use the features of the plan until you
						resume it.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						disabled={loading}
						variant="destructive"
						onClick={async () => {
							setLoading(true);

							await cancelSubscription({
								teamId,
							});

							await utils.team.getMembers.invalidate();

							setLoading(false);
							setShow(false);

							toast.success("Your plan has been paused.");
						}}
					>
						{loading && (
							<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
						)}
						Pause
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ResumePlanButton({ teamId }: { teamId: string }) {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: resumeSubscription } =
		api.stripe.resumeSubscription.useMutation();
	const utils = api.useUtils();
	return (
		<Button
			disabled={loading}
			onClick={async () => {
				setLoading(true);

				await resumeSubscription({
					teamId,
				});

				await utils.team.invalidate();

				setLoading(false);
			}}
		>
			{loading && (
				<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
			)}
			Resume Plan
		</Button>
	);
}

function PaymentSelector({ paymentMethods }: any) {
	const FormSchema = z.object({
		paymentMethod: z.string(),
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;

	const defaultValues: FormSchemaValues = {
		paymentMethod: "",
	};

	const form = useForm<FormSchemaValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	function onSubmit(data: FormSchemaValues) {
		console.log(data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="paymentMethod"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payment</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex select-none flex-col"
								>
									{paymentMethods.map((method: any) => (
										<label
											htmlFor={method.id}
											key={method.id}
											className="flex cursor-pointer items-center space-x-3 rounded-lg border border-border p-3"
										>
											<RadioGroupItem value={method.id} id={method.id} />
											<div className="flex w-full items-center justify-between">
												<div>
													<FormLabel
														htmlFor={method.id}
														className="cursor-pointer"
													>
														{method.name}
													</FormLabel>
													<FormDescription>
														Expiry {method.expiry}
													</FormDescription>
												</div>
											</div>
										</label>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function ProductSelection({ products }: { products: any }) {
	const FormSchema = z.object({
		subscription: z.string(),
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;

	const defaultValues: FormSchemaValues = {
		subscription: "",
	};

	const form = useForm<FormSchemaValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	function onSubmit(data: FormSchemaValues) {
		console.log(data);
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
							<ProductsSelector products={products} field={field} />
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function UpdatePlanButton() {
	const [loading, setLoading] = useState(false);
	const { data: products } = api.products.getProducts.useQuery();
	const { mutate: changeSubscription } =
		api.stripe.changeSubscription.useMutation();

	const paymentMethods = [
		{ id: "1", name: "Visa ending in 7658", expiry: "10/2024", brand: "visa" },
		{
			id: "2",
			name: "Mastercard ending in 8429",
			expiry: "04/2026",
			brand: "mastercard",
		},
		{
			id: "3",
			name: "Mastercard ending in 8439",
			expiry: "04/2026",
			brand: "mastercard",
		},
	];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" onClick={() => {}}>
					Update Plan
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select the plan & payment method</DialogTitle>
					<DialogDescription>
						You can change your plan and payment method at any time.
					</DialogDescription>
				</DialogHeader>
				<div className="my-2 space-y-2">
					<ProductSelection products={products} />
					<PaymentSelector paymentMethods={paymentMethods} />
				</div>
				<DialogFooter className="mt-4">
					<Button type="button" variant="outline">
						Cancel
					</Button>
					<Button disabled={loading} type="submit">
						{loading && (
							<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
						)}
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function TeamPaymentPlanCard() {
	const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();

	const { data: resp } = api.stripe.getSubscription.useQuery({
		id: teamId,
	});

	if (!resp || !resp?.currentPeriodEnd) {
		return null;
	}

	const currentPeriodEnd = getCurrentDate(resp.currentPeriodEnd * 1000);
	const currentPeriodStart = getCurrentDate(resp.currentPeriodStart * 1000);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="mb-2">Plan</CardTitle>
				<CardDescription>
					Your team is on the {resp.productName} subscription. The next payment
					of {resp.priceFormatted} will occur on {currentPeriodEnd}.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between">
				<div className="flex w-full flex-col space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Current billing cycle ({currentPeriodStart} - {currentPeriodEnd}).
						</span>
						<div className="space-x-2">
							<UpdatePlanButton />
							{stripeSubscriptionStatus === "active" && (
								<PausePlanButton teamId={teamId} />
							)}
							{stripeSubscriptionStatus !== "active" && (
								<ResumePlanButton teamId={teamId} />
							)}
						</div>
					</div>
				</div>
			</CardContent>
			<div className="rounded-b-xl bg-muted">
				<Separator className="my-2" />
				<CardFooter className="flex justify-between p-4">
					<span className="text-sm text-muted-foreground">
						Your plan includes a limited amount of free usage. If the usage on
						your projects exceeds the allotted limit, you will need to upgrade.
					</span>
				</CardFooter>
			</div>
		</Card>
	);
}

// {method.brand === "visa" && (
// 	<svg
// 		className="h-6 w-10"
// 		viewBox="0 0 780 780"
// 		fill="#1434CB"
// 	>
// 		<path d="M40,0h700c22.092,0,40,17.909,40,40v700c0,22.092-17.908,40-40,40H40c-22.091,0-40-17.908-40-40V40 C0,17.909,17.909,0,40,0z" />
// 		<path
// 			fill="#FFFFFF"
// 			d="m293.2 348.73l33.359-195.76h53.358l-33.384 195.76h-53.333zm246.11-191.54c-10.569-3.966-27.135-8.222-47.821-8.222-52.726 0-89.863 26.551-90.181 64.604-0.297 28.129 26.515 43.822 46.754 53.185 20.771 9.598 27.752 15.716 27.652 24.283-0.133 13.123-16.586 19.116-31.924 19.116-21.355 0-32.701-2.967-50.225-10.274l-6.878-3.112-7.487 43.822c12.463 5.466 35.508 10.199 59.438 10.445 56.09 0 92.502-26.248 92.916-66.884 0.199-22.27-14.016-39.216-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.56-16.838 17.446-0.271 30.088 3.534 39.936 7.5l4.781 2.259 7.231-42.427m137.31-4.223h-41.23c-12.773 0-22.332 3.486-27.941 16.234l-79.244 179.4h56.031s9.16-24.121 11.232-29.418c6.123 0 60.555 0.084 68.336 0.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.188-195.64zm-65.417 126.41c4.414-11.279 21.26-54.724 21.26-54.724-0.314 0.521 4.381-11.334 7.074-18.684l3.607 16.878 12.36 56.528h-44.301v3e-3zm-363.3-126.41l-52.24 133.5-5.566-27.129c-9.725-31.273-40.025-65.156-73.898-82.12l47.767 171.2 56.455-0.064 84.004-195.39-56.522-1e-3"
// 		/>
// 	</svg>
// )}
// {method.brand === "mastercard" && (
// 	<svg className="h-6 w-10" viewBox="0 0 780 780">
// 		<path d="M40,0h700c22.092,0,40,17.909,40,40v700c0,22.092-17.908,40-40,40H40c-22.091,0-40-17.908-40-40V40 C0,17.909,17.909,0,40,0z" />
// 		<path
// 			fill="#FF5F00"
// 			d="m473.27 306.53c0 99.61-81.478 180.39-181.96 180.39-100.49 0-181.97-80.776-181.97-180.39 0-99.613 81.477-180.39 181.97-180.39 100.48 0 181.96 80.777 181.96 180.39"
// 		/>
// 		<path
// 			fill="#EB001B"
// 			d="m317.05 306.53c0 64.724-52.864 117.19-118.08 117.19-65.215 0-118.08-52.465-118.08-117.19 0-64.725 52.864-117.19 118.08-117.19 65.215 0 118.08 52.465 118.08 117.19"
// 		/>
// 		<path
// 			fill="#F79E1B"
// 			d="m616.25 423.72v-7.8918h3.359v-1.6446h-8.4022v1.6446h3.3546v7.8918h1.6886zm16.539 0v-9.5363h-2.5645l-2.9603 7.0601-2.9557-7.0601h-2.5691v9.5363h1.6265v-7.2043l2.7748 6.4707h1.8359l2.7748-6.4707v7.2043h1.6376z"
// 		/>
// 		<path
// 			fill="#F79E1B"
// 			d="m535.9 306.53c0 99.61 81.478 180.39 181.96 180.39 100.49 0 181.97-80.776 181.97-180.39 0-99.613-81.477-180.39-181.97-180.39-100.48 0-181.96 80.777-181.96 180.39"
// 		/>
// 	</svg>
// )}
