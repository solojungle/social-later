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

export const PersonalNameFormSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

interface PersonalNameCardProps {
	formControl: Control<any, any>;
}

export function PersonalNameCard({ formControl }: PersonalNameCardProps) {
	const { name } = useUserStore();

	return (
		<SettingsCardBase
			title="Display Name"
			description="Please enter your full name, or a display name you are comfortable with."
			footerSubtitle="Please use 32 characters at maximum."
			content={
				<FormField
					control={formControl}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input
									placeholder="Your display name"
									{...field}
									defaultValue={name}
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
