"use client";

import { useParams } from "next/navigation";

import PersonalGeneralSettingsPage from "@/components/personalGeneralSettingsPage";
import PersonalNotificationsSettingsPage from "@/components/personalNotificationsSettingsPage";
import PersonalSecuritySettingsPage from "@/components/personalSecuritySettingsPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsAccountPage() {
	const params = useParams<{ page: string[]; id: string }>();

	let page: string = "general";
	if (params.page && params.page.length > 0) {
		[page] = params.page as [string];
	}

	type Page = "general" | "notifications" | "security";
	const defaultValue: Page =
		page === "general" || page === "notifications" || page === "security"
			? page
			: "general";

	return (
		<div className="!overflow-scroll p-3 pb-48">
			<Tabs defaultValue={defaultValue} className="w-full max-w-4xl">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
					<PersonalGeneralSettingsPage />
				</TabsContent>
				<TabsContent value="notifications">
					<PersonalNotificationsSettingsPage />
				</TabsContent>
				<TabsContent value="security">
					<PersonalSecuritySettingsPage />
				</TabsContent>
			</Tabs>
		</div>
	);
}
