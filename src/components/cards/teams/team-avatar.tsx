"use client";

import { Control } from "react-hook-form";
import * as z from "zod";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTeamStore } from "@/stores/teams";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export const teamAvatarFormSchema = z.object({
	image: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

interface TeamAvatarCardProps {
	formControl: Control<any, any>;
}

export function TeamAvatarCard({ formControl }: TeamAvatarCardProps) {
	const { selectedTeam } = useTeamStore();

	return (
		<SettingsCardBase
			title="Team Avatar"
			description="This is your team's avatar. Click to upload a custom one from
		your files."
			footerSubtitle="An avatar is optional but strongly recommended."
			content={
				<>
					<FormField
						control={formControl}
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
	);
}
