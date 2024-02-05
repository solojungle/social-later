"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserSchemaValues } from "@/schemas/user-schema";

export const KYCSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

export type KYCValues = z.infer<typeof KYCSchema>;

export function KYC() {
	const defaultValues = {
		name: "123",
	};

	const form = useForm<KYCValues>({
		resolver: zodResolver(KYCSchema.pick({ name: true })),
		defaultValues,
	});

	function onSubmit(data: UserSchemaValues) {
		toast("You submitted the following values:", {
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Notify me about...</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="all" />
										</FormControl>
										<FormLabel className="font-normal">
											All new messages
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="mentions" />
										</FormControl>
										<FormLabel className="font-normal">
											Direct messages and mentions
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="none" />
										</FormControl>
										<FormLabel className="font-normal">Nothing</FormLabel>
									</FormItem>
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
