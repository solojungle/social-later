import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	InvitationSchema,
	InvitationSchemaValues,
} from "@/schemas/invitation-schema";
import { useInvitationsStore } from "@/stores/invitations";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

function Content() {
	const { addInvitation } = useInvitationsStore();

	const createInvitation = api.invitation.create.useMutation({
		onSuccess: (input) => {
			addInvitation(input);

			toast.success("Invitation has been sent!", {
				description: "The invitation has been sent to the recipient.",
			});
		},
	});

	const { id: selectedTeamId } = useSelectedTeamStore();

	const defaultValues = {
		email: "",
		role: UserRole.MEMBER,
	};

	const form = useForm<InvitationSchemaValues>({
		resolver: zodResolver(InvitationSchema.pick({ email: true, role: true })),
		defaultValues,
	});

	function onSubmit(data: InvitationSchemaValues) {
		// Add teamId to the input
		const input = {
			...data,
			teamId: selectedTeamId,
		};

		createInvitation.mutate(input);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="mb-4 flex w-full items-start justify-between space-x-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel htmlFor="email">Email Address</FormLabel>
								<FormControl>
									<Input id="email" placeholder="jane@example.com" {...field} />
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
										<SelectItem value={UserRole.MEMBER}>Member</SelectItem>
										<SelectItem value={UserRole.OWNER}>Owner</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<span className="text-xs">
					Manage your team members and their roles. On the team <b>Settings</b>{" "}
					page.
				</span>
				<DialogFooter className="">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit">Invite</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}

export function AddTeamMemberModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" onClick={() => {}}>
					<PlusIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new team member</DialogTitle>
				</DialogHeader>
				<Content />
			</DialogContent>
		</Dialog>
	);
}
