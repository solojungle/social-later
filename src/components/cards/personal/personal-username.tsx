"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserSchema, UserSchemaValues } from "@/schemas/user-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { SettingsCardBase } from "../settings-card-base";

export function PersonalUsernameCard() {
	const { url, setUrl } = useUserStore();
	const { setUrl: setSelectedTeamsUrl } = useSelectedTeamStore();

	const updateUser = api.user.updateUser.useMutation();

	const defaultValues = {
		url,
	};

	const form = useForm<UserSchemaValues>({
		resolver: zodResolver(UserSchema.pick({ url: true })),
		defaultValues,
	});

	function onSubmit(data: UserSchemaValues) {
		// Make database call
		updateUser.mutate({
			url: data.url,
		});

		// Update local state
		setUrl(data.url);

		// Update selected team url
		setSelectedTeamsUrl(data.url);

		toast.success("You submitted the following values:", {
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
