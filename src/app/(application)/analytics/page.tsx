"use client";

import { AnalyticsPageContent } from "@/components/analyticsPageContent";
import { InterfaceIcons } from "@/components/ui/icons";
import { useUserStore } from "@/stores/user";

export default function AnalyticsPage() {
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return <AnalyticsPageContent />;
}
