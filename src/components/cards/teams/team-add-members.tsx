"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
	InvitationSchema,
	InvitationSchemaValues,
} from "@/schemas/invitation/invitation-schema";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { SettingsCardBase } from "../settings-card-base";

export function TeamAddMembersCard() {
	const defaultValues = {
		email: "",
		role: "member",
	};

	const form = useForm<InvitationSchemaValues>({
		resolver: zodResolver(InvitationSchema.pick({ email: true, role: true })),
		defaultValues,
	});

	function onSubmit(data: InvitationSchemaValues) {
		toast({
			title: "You submitted the following values:",
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
				<SettingsCardBase
					description="Invite new members by email address."
					footerSubtitle="An email will be sent to the recipient."
					buttonContent="Invite"
					content={
						<div className="flex w-full items-start justify-between space-x-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel htmlFor="email">Email Address</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="jane@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel htmlFor="role">Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger id="role">
													<SelectValue placeholder="Member Role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="member">Member</SelectItem>
												<SelectItem value="owner">Owner</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					}
				/>
			</form>
		</Form>
	);
}
