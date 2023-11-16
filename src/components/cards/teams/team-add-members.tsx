"use client";

import { LinkIcon } from "lucide-react";
import * as z from "zod";

import { Button } from "../../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { Separator } from "../../ui/separator";

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
		<Card>
			<CardHeader>
				<div className="flex flex-row items-center justify-between">
					<CardDescription>Invite new members by email address</CardDescription>
					<Button variant="secondary" className="flex items-center space-x-2">
						<LinkIcon className="h-4 w-4" />
						<span>Invite Link</span>
					</Button>
				</div>
				<div>
					<Separator className="my-2" />
				</div>
			</CardHeader>
			<CardContent className="flex items-center justify-between space-x-2">
				<div className="w-full">
					<Label htmlFor="email">Email Address</Label>
					<Input id="email" placeholder="jane@example.com" />
				</div>
				<div className="w-full">
					<Label htmlFor="role">Role</Label>
					<Select defaultValue="member">
						<SelectTrigger>
							<SelectValue placeholder="All Team Roles" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="member">Member</SelectItem>
							<SelectItem value="owner">Owner</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<div className="rounded-b-lg bg-muted">
				<Separator className="my-2" />
				<CardFooter className="flex justify-between pb-2">
					<span className="text-sm text-muted-foreground">
						An email will be sent to the recipient.
					</span>
					<Button>Invite</Button>
				</CardFooter>
			</div>
		</Card>
	);
}
