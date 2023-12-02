"use client";

import { Mail, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

const data = [
	{
		name: "ali awari",
		email: "ali@seriesfi.com",
		role: "Owner",
		avatar: "https://avatar.vercel.sh/solojungle.png",
	},
	{
		name: "john awari",
		email: "ali@seriesfi.com",
		role: "Member",
		avatar: "https://avatar.vercel.sh/shirt.png",
	},
	{
		name: "ace awari",
		email: "ali@seriesfi.com",
		role: "Member",
		avatar: "https://avatar.vercel.sh/aisad.png",
	},
	{
		name: "back awari",
		email: "ali@seriesfi.com",
		role: "Owner",
		avatar: "https://avatar.vercel.sh/xbbd.png",
	},
	{
		name: "lack awari",
		email: "ali@seriesfi.com",
		role: "Member",
		avatar: "https://avatar.vercel.sh/qwewqe.png",
	},
	{
		name: "tack awari",
		email: "ali@seriesfi.com",
		role: "Member",
		avatar: "https://avatar.vercel.sh/asdbha.png",
	},
	{
		name: "frack awari",
		email: "ali@seriesfi.com",
		role: "Member",
		avatar: "https://avatar.vercel.sh/ahsdnahs.png",
	},
];

export function InvitesTable() {
	const { id } = useSelectedTeamStore();

	const { data: pendingInvitesData } =
		api.invitation.getPendingInvitations.useQuery({ id });

	const invitations = pendingInvitesData ?? [];

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
				{invitations.map((t) => {
					return (
						<TableRow key={t.email}>
							<TableCell>
								<div className="flex items-center justify-between pr-5">
									<div className="flex items-center">
										<Checkbox className="mr-4" />
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
										<span className="mr-4 text-muted-foreground">{t.role}</span>
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
		</Table>
	);
}
