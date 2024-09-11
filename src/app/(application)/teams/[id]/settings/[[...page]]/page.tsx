"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";

import BillingPage from "@/components/billingPage";
import GeneralTeamSettingsPage from "@/components/generalPage";
import TeamMembersPage from "@/components/membersPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum Page {
	General = "general",
	Members = "members",
	Billing = "billing",
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
			<Tabs defaultValue={page} className="w-full max-w-4xl">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="general" onClick={() => setPage(Page.General)}>
						General
					</TabsTrigger>
					<TabsTrigger value="members" onClick={() => setPage(Page.Members)}>
						Members
					</TabsTrigger>
					<TabsTrigger value="billing" onClick={() => setPage(Page.Billing)}>
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
