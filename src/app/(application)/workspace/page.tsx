"use client";

import { Loader2 } from "lucide-react";

import { ResizablePanel } from "@/components/ui/resizable";
import { useUserStore } from "@/stores/user";

import { WorkspacePageContent } from "./content";

export default function WorkspacePage() {
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<ResizablePanel id="no-user-loading" order={2} defaultSize={80}>
				<div className="flex h-full flex-col items-center justify-center">
					<Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
				</div>
			</ResizablePanel>
		);
	}

	return <WorkspacePageContent />;
}
