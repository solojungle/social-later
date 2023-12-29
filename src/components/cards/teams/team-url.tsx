"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { TeamSchema, TeamSchemaValues } from "@/schemas/team-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

import { SettingsCardBase } from "../settings-card-base";

export function TeamUrlCard() {
	const { url, setUrl, id } = useSelectedTeamStore();
	const { updateTeamUrl } = useTeamStore();
	const router = useRouter();

	const updateTeam = api.team.update.useMutation();

	const defaultValues = {
		url,
	};

	const form = useForm<TeamSchemaValues>({
		resolver: zodResolver(TeamSchema.pick({ url: true })),
		defaultValues,
	});

	function onSubmit(data: TeamSchemaValues) {
		// Make database call
		updateTeam.mutate({
			id,
			url: data.url,
		});

		// Update the team url in the list of teams
		updateTeamUrl(id, data.url);

		// Update the selected team url
		setUrl(data.url);

		// Change the url in the browser, by change :id in "/teams/:id/settings" to the new url
		router.replace(`/teams/${data.url}/settings`);

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
