"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Archive, Inbox, Send, Trash2 } from "lucide-react";
import { useState } from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { Separator } from "../ui/separator";
import { AccountsNav } from "./accountsNav";
import { Nav } from "./nav";

interface ResizableLayoutProps {
	children: React.ReactNode;
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}

export function ResizableLayout({
	children,
	defaultLayout = [265, 440, 655],
	defaultCollapsed = false,
	navCollapsedSize,
}: ResizableLayoutProps) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

	const { id: teamId } = useSelectedTeamStore();

	const { data } = api.socials.getTwitterAccounts.useQuery({ id: teamId });

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible
					minSize={15}
					maxSize={20}
					onCollapse={() => setIsCollapsed(true)}
					onExpand={() => setIsCollapsed(false)}
					className={cn(
						isCollapsed &&
							"min-w-[50px] transition-all duration-300 ease-in-out",
					)}
				>
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Create Post",
								label: "",
								icon: Send,
								variant: "default",
							},
							{
								title: "Queue",
								label: "128",
								icon: Inbox,
								variant: "ghost",
							},
							{
								title: "Drafts",
								label: "",
								icon: Archive,
								variant: "ghost",
							},
							{
								title: "Trash",
								label: "",
								icon: Trash2,
								variant: "ghost",
							},
						]}
					/>
					<Separator />
					<AccountsNav isCollapsed={isCollapsed} accounts={data} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				{children}
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
