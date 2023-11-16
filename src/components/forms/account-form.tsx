"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

import { PersonalAvatarCard } from "../cards/personal/personal-avatar";
import { PersonalNameCard } from "../cards/personal/personal-name";

const accountFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters.",
		})
		.max(30, {
			message: "Name must not be longer than 30 characters.",
		}),
	url: z
		.string()
		.min(2, {
			message: "URL must be at least 2 characters.",
		})
		.max(30, {
			message: "URL must not be longer than 30 characters.",
		}),
	dob: z.date({
		required_error: "A date of birth is required.",
	}),
	language: z.string({
		required_error: "Please select a language.",
	}),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
	// name: "Your name",
	// dob: new Date("2023-01-23"),
};

export function AccountForm() {
	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues,
	});

	function onSubmit(data: AccountFormValues) {
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
				<PersonalAvatarCard formControl={form.control} />
				<PersonalNameCard formControl={form.control} />
			</form>
		</Form>
	);
}
