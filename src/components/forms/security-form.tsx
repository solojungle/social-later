"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { Personal2FACard } from "../cards/personal/personal-2fa";

const SecurityFormSchema = z.object({
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

type SecurityFormValues = z.infer<typeof SecurityFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<SecurityFormValues> = {
	// name: "Your name",
	// dob: new Date("2023-01-23"),
};

export function SecurityForm() {
	const form = useForm<SecurityFormValues>({
		resolver: zodResolver(SecurityFormSchema),
		defaultValues,
	});

	function onSubmit(data: SecurityFormValues) {
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
				<Personal2FACard />
			</form>
		</Form>
	);
}
