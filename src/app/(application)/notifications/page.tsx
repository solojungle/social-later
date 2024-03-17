"use client";

import { ResizablePanel } from "@/components/ui/resizable";

export default function NotificationsPage() {
	return (
		<ResizablePanel id="notifications" order={2} defaultSize={80}>
			Notifications
		</ResizablePanel>
	);
}
