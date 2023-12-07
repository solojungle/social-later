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
import { TeamSchema, TeamSchemaValues } from "@/schemas/team-schema";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

type TeamSwitcherModalProps = {
	setShowNewTeamDialog: any;
};

export default function TeamSwitcherModal({
	setShowNewTeamDialog,
}: TeamSwitcherModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const { addTeam } = useTeamStore();

	const createTeam = api.team.create.useMutation({
		onSuccess: (data) => {
			addTeam({
				...data,
				type: "team",
				imageFallbackInitials: "TT",
			});
		},
	});

	const defaultValues: Partial<TeamSchemaValues> = {
		name: "",
	};

	const form = useForm<TeamSchemaValues>({
		resolver: zodResolver(TeamSchema.pick({ name: true })),
		defaultValues,
	});

	async function onSubmit(data: TeamSchemaValues) {
		try {
			setIsLoading(true);

			createTeam.mutate({
				name: data.name,
			});

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
