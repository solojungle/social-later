"use client";

import { Control } from "react-hook-form";
import * as z from "zod";

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTeamStore } from "@/stores/teams";

import { SettingsCardBase } from "../settings-card-base";

export const teamUrlFormSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

interface TeamNameCardProps {
	formControl: Control<any, any>;
}

export function TeamNameCard({ formControl }: TeamNameCardProps) {
	const { selectedTeam } = useTeamStore();

	return (
		<SettingsCardBase
			title="Team Name"
			description="This is your team's name visible name within this app. For example, the name of your company or department."
			footerSubtitle="Please use 32 characters at maximum."
			content={
				<FormField
					control={formControl}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input
									placeholder="Your team's name"
									defaultValue={selectedTeam.name}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			}
		/>
	);
}
