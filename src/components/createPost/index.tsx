"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";

import { Input } from "../ui/input";

function SelectSocialAccount() {
	return (
		<Select>
			<SelectTrigger className="w-max">
				<SelectValue placeholder="Select an account" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Twitter</SelectLabel>
					<SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export function CreatePost() {
	const tweet = api.socials.postTweet.useMutation();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<SelectSocialAccount />
					</div>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Input className="col-span-3" />
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={() => {
							tweet.mutate({
								id: "clr6vvzz80008sofdtxfuz8me",
							});
						}}
					>
						Create Post
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
