"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { TeamSchema, TeamSchemaValues } from "@/schemas/team-schema";
import { useTeamStore } from "@/stores/teams";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export function TeamAvatarCard() {
	const { selectedTeam } = useTeamStore();

	const defaultValues = {
		image: selectedTeam.image,
	};

	const form = useForm<TeamSchemaValues>({
		resolver: zodResolver(TeamSchema.pick({ image: true })),
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
					title="Team Avatar"
					description="This is your team's avatar. Click to upload a custom one from
		your files."
					footerSubtitle="An avatar is optional but strongly recommended."
					content={
						<>
							<FormField
								control={form.control}
								name="image"
								render={() => (
									<FormItem>
										<FormLabel>File Upload</FormLabel>
										<FormControl>
											<Input id="picture" type="file" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Avatar className="mr-2 h-20 w-20">
								<AvatarImage src={selectedTeam.image} alt={selectedTeam.name} />
								<AvatarFallback>
									{selectedTeam.imageFallbackInitials}
								</AvatarFallback>
							</Avatar>
						</>
					}
				/>
			</form>
		</Form>
	);
}
