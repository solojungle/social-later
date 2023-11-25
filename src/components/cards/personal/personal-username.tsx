"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { UserSchema, UserSchemaValues } from "@/schemas/user-schema";
import { useUserStore } from "@/stores/user";

import { SettingsCardBase } from "../settings-card-base";

export function PersonalUsernameCard() {
	const { url } = useUserStore();

	const defaultValues = {
		url,
	};

	const form = useForm<UserSchemaValues>({
		resolver: zodResolver(UserSchema.pick({ url: true })),
		defaultValues,
	});

	function onSubmit(data: UserSchemaValues) {
		toast({
			title: "You submitted the following values:",
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
				<SettingsCardBase
					title="Username"
					description="Your username acts also acts as your URL namespace."
					footerSubtitle="Please use 48 characters at maximum."
					content={
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input placeholder="Your username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					}
				/>
			</form>
		</Form>
	);
}
