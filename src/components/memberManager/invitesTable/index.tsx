"use client";

import { Mail, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

export function InvitesTable() {
	const { id } = useSelectedTeamStore();

	const { data: pendingInvitesData } =
		api.invitation.getPendingInvitations.useQuery({ id });

	const invitations = pendingInvitesData ?? [];

	return (
		<Table className="w-full">
			<div className="flex w-full items-center justify-between rounded-lg border bg-muted px-4 py-2 pr-5">
				<div className="flex items-center">
					<Checkbox className="mr-4" />
					<span className="text-muted-foreground">Select all</span>
				</div>
				<Button size="icon" variant="ghost">
					<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
				</Button>
			</div>
			{invitations.length === 0 ? (
				<TableBody>
					<p className="py-4 text-center text-muted-foreground">
						No pending invitations.
					</p>
				</TableBody>
			) : (
				<TableBody>
					{invitations.map((t) => {
						return (
							<TableRow key={t.email}>
								<TableCell className="rounded-lg">
									<div className="flex items-center justify-between pr-5">
										<div className="flex items-center">
											<Checkbox className="ml-2 mr-4" />
											<Avatar className="mr-4 h-8 w-8">
												<AvatarFallback>
													{`${t.email[0]?.toUpperCase()}`}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<div className="flex items-center">
													<span className="mr-2 font-medium">
														Pending Invitation
													</span>
													<Mail className="h-4 w-4 text-muted-foreground" />
												</div>
												<span className="font-normal text-muted-foreground">
													{t.email}
												</span>
											</div>
										</div>
										<div className="flex items-center">
											<span className="mr-6 capitalize text-muted-foreground">
												{t.role}
											</span>
											<Button size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
											</Button>
										</div>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			)}
		</Table>
	);
}
