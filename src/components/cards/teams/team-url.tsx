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
import { TeamSchema, TeamSchemaValues } from "@/schemas/team/team-schema";
import { useTeamStore } from "@/stores/teams";

import { SettingsCardBase } from "../settings-card-base";

export function TeamUrlCard() {
	const { selectedTeam } = useTeamStore();

	const defaultValues = {
		url: selectedTeam.url,
	};

	const form = useForm<TeamSchemaValues>({
		resolver: zodResolver(TeamSchema.pick({ url: true })),
		defaultValues,
	});

	function onSubmit(data: TeamSchemaValues) {
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
					title="Team URL"
					description="This is your team's URL namespace. You can inspect your projects, check out recent activity, or configure settings to your liking."
					footerSubtitle="Please use 48 characters at maximum."
					content={
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input placeholder="Your team's url" {...field} />
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
