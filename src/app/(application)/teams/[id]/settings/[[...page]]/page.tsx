"use client";

import { useParams } from "next/navigation";

import BillingPage from "@/components/billingPage";
import GeneralTeamSettingsPage from "@/components/generalPage";
import TeamMembersPage from "@/components/membersPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsLayout() {
	const params = useParams<{ page: string[]; id: string }>();

	let page: string = "general";
	if (params.page && params.page.length > 0) {
		[page] = params.page as [string];
	}

	type Page = "general" | "members" | "billing" | "notifications" | "security";
	const defaultValue: Page =
		page === "general" ||
		page === "members" ||
		page === "billing" ||
		page === "notifications" ||
		page === "security"
			? page
			: "general";

	return (
		<div className="!overflow-scroll p-3 pb-48">
			<Tabs defaultValue={defaultValue} className="w-full max-w-4xl">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
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
