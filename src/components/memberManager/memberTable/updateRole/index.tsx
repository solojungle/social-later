"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { InterfaceIcons } from "@/components/ui/icons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

function UpdateForm({
	member,
	onOpenChange,
}: {
	member: any;
	onOpenChange: any;
}) {
	const { id: teamId } = useSelectedTeamStore();
	const [loading, setLoading] = useState(false);
	const utils = api.useUtils();

	const { mutateAsync: updateRole } = api.user.updateUserRole.useMutation({
		onSuccess: () => {
			toast.success("Role updated successfully");
			utils.team.getMembers.invalidate();
		},
		onError: () => {
			toast.error("Failed to update role");
		},
		onSettled: () => {
			setLoading(false);
			onOpenChange(false);
		},
	});

	const defaultValues = {
		role: UserRole.MEMBER,
	};

	const FormSchema = z.object({
		role: z.nativeEnum(UserRole),
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;

	const form = useForm<FormSchemaValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	async function onSubmit(data: FormSchemaValues) {
		setLoading(true);
		await updateRole({
			role: data.role,
			teamId,
			userId: member.id,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel htmlFor="role">Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger id="role">
										<SelectValue placeholder="Member Role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem
										disabled={member.role === UserRole.MEMBER}
										value={UserRole.MEMBER}
									>
										Member
									</SelectItem>
									<SelectItem
										disabled={member.role === UserRole.OWNER}
										value={UserRole.OWNER}
									>
										Owner
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className="mt-4">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
					<Button disabled={loading} type="submit">
						{loading && (
							<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
						)}
						Save
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}

export function UpdateRoleDialog({ open, onOpenChange, member }: any) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change the role of user</DialogTitle>
					<DialogDescription>
						Select the role you want to assign to the user
					</DialogDescription>
				</DialogHeader>
				<UpdateForm onOpenChange={onOpenChange} member={member} />
			</DialogContent>
		</Dialog>
	);
}
