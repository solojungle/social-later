import { TeamAddMembersCard } from "@/components/cards/teams/team-add-members";
import { MemberManager } from "@/components/memberManager";
import { Separator } from "@/components/ui/separator";

export default function TeamMembersPage() {
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
