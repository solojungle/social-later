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
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

import { SettingsCardBase } from "../settings-card-base";

export function TeamNameCard() {
	const { name, id, setName } = useSelectedTeamStore();
	const { updateTeamName } = useTeamStore();

	const updateTeam = api.team.update.useMutation();

	const defaultValues = {
		name,
	};

	const form = useForm<TeamSchemaValues>({
		resolver: zodResolver(TeamSchema.pick({ name: true })),
		defaultValues,
	});

	function onSubmit(data: TeamSchemaValues) {
		// Update the team name in the database
		updateTeam.mutate({
			id,
			name: data.name,
		});

		// Update the team name in the list of teams
		updateTeamName(id, data.name);

		// Update selected team name
		setName(data.name);

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
					title="Team Name"
					description="This is your team's name visible name within this app. For example, the name of your company or department."
					footerSubtitle="Please use 32 characters at maximum."
					content={
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input placeholder="Your team's name" {...field} />
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
