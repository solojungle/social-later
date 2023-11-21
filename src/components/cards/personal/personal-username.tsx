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
import { useUserStore } from "@/stores/user";

import { SettingsCardBase } from "../settings-card-base";

export const PersonalUsernameFormSchema = z.object({
	url: z
		.string()
		.min(1, {
			message: "URL must be at least 1 character.",
		})
		.max(48, {
			message: "URL must not be longer than 48 characters.",
		}),
});

interface PersonalUsernameCardProps {
	formControl: Control<any, any>;
}

export function PersonalUsernameCard({
	formControl,
}: PersonalUsernameCardProps) {
	const { url } = useUserStore();

	return (
		<SettingsCardBase
			title="Username"
			description="Your username acts also acts as your URL namespace."
			footerSubtitle="Please use 48 characters at maximum."
			content={
				<FormField
					control={formControl}
					name="url"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input
									placeholder="Your username"
									{...field}
									defaultValue={url}
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
