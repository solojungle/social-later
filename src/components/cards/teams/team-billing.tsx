"use client";

import { Control } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SettingsCardBase } from "../settings-card-base";

interface TeamNameCardProps {
	formControl: Control<any, any>;
}

export function TeamNameCard({ formControl }: TeamNameCardProps) {
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
								<Input placeholder="Your team's name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			}
		/>
	);
}
