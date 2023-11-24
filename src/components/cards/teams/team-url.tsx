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

import { SettingsCardBase } from "../settings-card-base";

export const teamUrlFormSchema = z.object({
	url: z
		.string()
		.min(1, {
			message: "URL must be at least 1 character.",
		})
		.max(48, {
			message: "URL must not be longer than 48 characters.",
		}),
});

interface TeamUrlCardProps {
	formControl: Control<any, any>;
}

export function TeamUrlCard() {
	return (
		<SettingsCardBase
			title="Team URL"
			description="This is your team's URL namespace. You can inspect your projects, check out recent activity, or configure settings to your liking."
			footerSubtitle="Please use 48 characters at maximum."
			content={
				<FormField
					control={formControl}
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
	);
}
