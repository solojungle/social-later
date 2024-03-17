"use client";

import { ResizablePanel } from "@/components/ui/resizable";

export default function HelpCenterPage() {
	return (
		<ResizablePanel id="help" order={2} defaultSize={80}>
			Help center
		</ResizablePanel>
	);
}
