"use client";

import { InterfaceIcons } from "@/components/ui/icons";
import { ResizablePanel } from "@/components/ui/resizable";
import { useUserStore } from "@/stores/user";

import { NexusPageContent } from "./content";

export default function NexusPage() {
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<ResizablePanel id="no-user-loading" order={2} defaultSize={80}>
				<div className="flex h-full flex-col items-center justify-center">
					<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
				</div>
			</ResizablePanel>
		);
	}

	return <NexusPageContent />;
}
