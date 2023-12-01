import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FacetedFilter } from "./facetedFilter";
import { InvitesTable } from "./invitesTable";
import { MembersTable } from "./memberTable";

export function MemberManager() {
	return (
		<Tabs defaultValue="members" className="w-full ">
			<TabsList>
				<TabsTrigger value="members">Team Members</TabsTrigger>
				<TabsTrigger value="invites">Pending Invitations</TabsTrigger>
			</TabsList>
			<TabsContent value="members" className="mb-72">
				<FacetedFilter />
				<MembersTable />
			</TabsContent>
			<TabsContent value="invites">
				<FacetedFilter />
				<InvitesTable />
			</TabsContent>
		</Tabs>
	);
}
