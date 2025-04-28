import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FacetedFilter } from "./facetedFilter";
import { InvitesTable } from "./invitesTable";
import { MembersTable } from "./memberTable";

export function MemberManager() {
  return (
    <Tabs className="w-full " defaultValue="members">
      <TabsList>
        <TabsTrigger value="members">Team Members</TabsTrigger>
        <TabsTrigger value="invites">Pending Invitations</TabsTrigger>
      </TabsList>
      <TabsContent className="mb-72" value="members">
        <FacetedFilter />
        <MembersTable />
      </TabsContent>
      <TabsContent className="mb-72" value="invites">
        <FacetedFilter />
        <InvitesTable />
      </TabsContent>
    </Tabs>
  );
}
