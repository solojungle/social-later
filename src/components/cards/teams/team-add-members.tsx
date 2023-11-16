"use client";

import * as z from "zod";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { SettingsCardBase } from "../settings-card-base";

export const TeamAddMembersFormSchema = z.object({
	avatar: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

export function TeamAddMembersCard() {
	return (
		<SettingsCardBase
			description="Invite new members by email address."
			footerSubtitle="An email will be sent to the recipient."
			buttonContent="Invite"
			content={
				<div className="flex w-full items-center justify-between space-x-2">
					<div className="w-full">
						<Label htmlFor="email">Email Address</Label>
						<Input id="email" placeholder="jane@example.com" />
					</div>
					<div className="w-full">
						<Label htmlFor="role">Role</Label>
						<Select defaultValue="member">
							<SelectTrigger>
								<SelectValue placeholder="Member Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="member">Member</SelectItem>
								<SelectItem value="owner">Owner</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			}
		/>
	);
}
