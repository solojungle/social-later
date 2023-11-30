"use client";

import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

export function MembersTable() {
	const { id } = useSelectedTeamStore();

	const { data: selectedTeamData } = api.team.getMembers.useQuery({ id });

	const members = selectedTeamData ?? [];

	return (
		<Table className="w-full border">
			<div className="flex w-full items-center justify-between bg-muted px-4 py-2 pr-5">
				<div className="flex items-center">
					<Checkbox className="mr-4" />
					<span>Select all</span>
				</div>
				<Button size="icon" variant="ghost">
					<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
				</Button>
			</div>
			<TableBody>
				{members.map((t) => {
					return (
						<TableRow key={t.email}>
							<TableCell>
								<div className="flex items-center justify-between pr-5">
									<div className="flex items-center">
										<Checkbox className="ml-2 mr-4" />
										<Avatar className="mr-4 h-8 w-8">
											<AvatarImage src={t.image} alt="label" />
											<AvatarFallback>SC</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<span className="font-medium">{t.name}</span>
											<span className="font-normal lowercase text-muted-foreground">
												{t.email}
											</span>
										</div>
									</div>
									<div className="flex items-center">
										<span className="mr-6 text-muted-foreground">{t.role}</span>
										<Button variant="secondary">Manage Role</Button>
									</div>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
