"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface PostTweetProps {
	accounts: any;
}

const UserSchema = z.object({
	id: z.string(),
	media: z.array(z.string()),
	text: z.string().min(1),
});

export type UserSchemaValues = z.infer<typeof UserSchema>;

function TweetForm() {
	const form = useForm<UserSchemaValues>({
		resolver: zodResolver(UserSchema.pick({ media: true })),
	});

	function onSubmit(data: any) {
		toast("You submitted the following values:", {
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="text"
					render={() => (
						<FormItem>
							<FormLabel>Text</FormLabel>
							<FormControl>
								<Input id="picture" type="text" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="media"
					render={() => (
						<FormItem>
							<FormLabel>Media Upload</FormLabel>
							<FormControl>
								<Input id="picture" type="file" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function PostTweet({ accounts }: PostTweetProps) {
	const tweet = api.socials.postTweet.useMutation();

	return (
		<div className="w-[350px]">
			<div>
				<h2 className="text-xl font-bold tracking-tight">Create Post</h2>
				<div>Post on your social media accounts.</div>
			</div>
			<div>
				<TweetForm />
			</div>
		</div>
	);
}

export function CreatePost() {
	const { id: teamId } = useSelectedTeamStore();

	const response = api.socials.getTwitterAccounts.useQuery({
		id: teamId,
	});

	const { data: accounts } = response;

	if (!accounts) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<PostTweet accounts={accounts} />
		</div>
	);
}
