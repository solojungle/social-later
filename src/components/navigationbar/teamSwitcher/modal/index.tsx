"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
	defaultValues,
	teamCreationFormSchema,
	TeamCreationFormValues,
} from "@/schemas/team-creation-schema";
import { api } from "@/trpc/react";

type TeamSwitcherModalProps = {
	setShowNewTeamDialog: any;
};

export default function TeamSwitcherModal({
	setShowNewTeamDialog,
}: TeamSwitcherModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { toast } = useToast();

	const createTeam = api.team.create.useMutation();

	const form = useForm<TeamCreationFormValues>({
		resolver: zodResolver(teamCreationFormSchema),
		defaultValues,
	});

	function onSubmit(data: TeamCreationFormValues) {
		try {
			setIsLoading(true);
			createTeam.mutate(data);
			toast({
				title: `Successfully created your team!`,
				description: `To view your new team, click on the team switcher.`,
			});
		} catch (error) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
				variant: "destructive",
			});

			throw error;
		} finally {
			setIsLoading(false);
			setShowNewTeamDialog(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Team name</FormLabel>
							<FormControl>
								<Input placeholder="Acme Inc." {...field} />
							</FormControl>
							<FormDescription>
								This is your team&apos;s display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className="mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => setShowNewTeamDialog(false)}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Continue
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
