"use client";

import { useEffect } from "react";

import { TeamAddMembersCard } from "@/components/cards/teams/team-add-members";
import { MemberManager } from "@/components/memberManager";
import { Separator } from "@/components/ui/separator";
import { useInvitationsStore } from "@/stores/invitations";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamMembersStore } from "@/stores/team-members";
import { api } from "@/trpc/react";

export default function TeamMembersPage() {
	const { id: selectedTeamId } = useSelectedTeamStore();
	const { data: invitations } = api.invitation.getPendingInvitations.useQuery({
		id: selectedTeamId,
	});

	const { data: members } = api.team.getMembers.useQuery({
		id: selectedTeamId,
	});

	useEffect(() => {
		if (!members || !invitations) return;
		useTeamMembersStore.setState({ members });
		useInvitationsStore.setState({ invitations });
	}, [members, invitations]);

	return (
		<div className="w-full space-y-6">
			<div>
				<h3 className="text-lg font-medium">Members</h3>
				<p className="text-sm text-muted-foreground">
					Manage and invite Team Members
				</p>
			</div>
			<Separator />
			<div className="space-y-14">
				<TeamAddMembersCard />
				<MemberManager />
			</div>
		</div>
	);
}
