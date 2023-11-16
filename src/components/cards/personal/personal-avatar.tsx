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

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export const PersonalAvatarFormSchema = z.object({
	avatar: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

interface PersonalAvatarCardProps {
	formControl: Control<any, any>;
}

export function PersonalAvatarCard({ formControl }: PersonalAvatarCardProps) {
	return (
		<SettingsCardBase
			title="Avatar"
			description="This is your avatar. Click to upload a custom one from
		your files."
			footerSubtitle="An avatar is optional but strongly recommended."
			content={
				<>
					<FormField
						control={formControl}
						name="avatar"
						render={({ field }) => (
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
						<AvatarImage
							src="https://avatar.vercel.sh/squirt.png"
							alt="label"
						/>
						<AvatarFallback>SC</AvatarFallback>
					</Avatar>
				</>
			}
		/>
	);
}
