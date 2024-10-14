"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getPaymentMethodIcon } from "@/components/ccicon";
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

function PaymentSelector({ paymentMethods, form }: any) {
	if (!paymentMethods) {
		return (
			<div className="flex items-center justify-center p-5">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<FormField
			control={form.control}
			name="paymentMethod"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Select Payment</FormLabel>
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
									className="flex cursor-pointer items-center space-x-3 rounded-lg border border-border bg-background p-3 ring-primary/40 transition duration-75 ease-in-out [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-2"
								>
									<RadioGroupItem value={method.id} id={method.id} />
									<div className="flex w-full items-center justify-between">
										<div>
											<FormLabel htmlFor={method.id} className="cursor-pointer">
												<span className="capitalize">{method.brand}</span>
												{` ending in ${method.last4}`}
											</FormLabel>
											<FormDescription className="flex items-center space-x-2">
												<span className="text-xs uppercase">Expiry</span>
												<span className="text-foreground">{`${method.expMonth}/${method.expYear}`}</span>
											</FormDescription>
										</div>
										{getPaymentMethodIcon(method.brand)}
									</div>
								</label>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function ProductSelection({
	products,
	form,
	planId,
}: {
	products: any;
	form: any;
	planId?: string[];
}) {
	return (
		<FormField
			control={form.control}
			name="subscription"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Subscriptions</FormLabel>
					<ProductsSelector
						products={products}
						field={field}
						disabledProduct={planId || []}
					/>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function UpdatePlanButtonForm({
	products,
	paymentMethods,
	planId,
	setOpen,
}: {
	products: any;
	paymentMethods: any;
	planId: string;
	setOpen: any;
}) {
	const [loading, setLoading] = useState(false);
	const utils = api.useUtils();

	const { mutateAsync: changeSubscription } =
		api.stripe.changeSubscription.useMutation({
			onSuccess() {
				toast.success("Your subscription has been updated.");
				utils.stripe.getSubscription.invalidate();
			},
			onError() {
				toast.error("An error occurred while updating your subscription.");
			},
			onSettled() {
				setLoading(false);
				setOpen(false);
			},
		});

	const FormSchema = z.object({
		paymentMethod: z.string().min(1),
		subscription: z.string().min(1),
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;

	const defaultPaymentMethod = paymentMethods?.find(
		(method: any) => method.isDefault,
	)?.id;

	const defaultProduct = products?.find(
		(product: any) => product.stripeProductId !== planId,
	);

	const defaultValues = {
		paymentMethod: defaultPaymentMethod,
		subscription: defaultProduct?.stripePriceId,
	};

	const form = useForm<FormSchemaValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	async function onSubmit(data: any) {
		setLoading(true);

		await changeSubscription({
			teamId: useSelectedTeamStore.getState().id,
			priceId: data.subscription,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="my-2 space-y-4">
				<ProductSelection form={form} products={products} planId={[planId]} />
				<PaymentSelector form={form} paymentMethods={paymentMethods} />
				<DialogFooter className="!mt-10">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
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

export function UpdatePlanButton({
	className,
	text,
	size,
	variant,
}: {
	className?: string;
	text?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "disabled";
}) {
	const { id: teamId } = useSelectedTeamStore();
	const [open, setOpen] = useState(false);
	const { data: products } = api.products.getProducts.useQuery();
	const { data: paymentMethods } = api.stripe.getPaymentMethods.useQuery(
		{
			id: teamId,
		},
		{
			enabled: !!teamId,
		},
	);

	// the teams current subscription
	const { data: subscriptionData } = api.stripe.getSubscription.useQuery({
		id: teamId,
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={variant ?? "outline"}
					size={size ?? "default"}
					className={className}
				>
					{text ?? "Update Plan"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select the plan & payment method</DialogTitle>
					<DialogDescription>
						You can change your plan and payment method at any time.
					</DialogDescription>
				</DialogHeader>
				{products && paymentMethods && (
					<UpdatePlanButtonForm
						products={products}
						paymentMethods={paymentMethods}
						planId={subscriptionData?.productId ?? ""}
						setOpen={setOpen}
					/>
				)}
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
						<div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
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
