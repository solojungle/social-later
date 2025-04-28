"use client";

import BillingPage from "@/components/billingPage";
import GeneralTeamSettingsPage from "@/components/generalPage";
import TeamMembersPage from "@/components/membersPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsStringEnum, useQueryState } from "nuqs";

enum Page {
  Billing = "billing",
  General = "general",
  Members = "members",
  Notifications = "notifications",
  Security = "security",
}

export default function SettingsLayout() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsStringEnum<Page>(Object.values(Page)).withDefault(Page.General),
  );

  return (
    <div className="!overflow-scroll p-3 pb-48">
      <Tabs className="w-full max-w-4xl" defaultValue={page}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger onClick={() => setPage(Page.General)} value="general">
            General
          </TabsTrigger>
          <TabsTrigger onClick={() => setPage(Page.Members)} value="members">
            Members
          </TabsTrigger>
          <TabsTrigger onClick={() => setPage(Page.Billing)} value="billing">
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralTeamSettingsPage />
        </TabsContent>
        <TabsContent value="members">
          <TeamMembersPage />
        </TabsContent>
        <TabsContent value="billing">
          <BillingPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
