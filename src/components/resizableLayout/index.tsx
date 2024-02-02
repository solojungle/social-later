"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
	Archive,
	BellIcon,
	Calendar,
	HelpCircleIcon,
	PieChartIcon,
	SettingsIcon,
	Trash2,
	UserIcon,
} from "lucide-react";
import { useState } from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

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
					<div className="flex h-full flex-col justify-between py-5">
						<Nav
							isCollapsed={isCollapsed}
							links={[
								{
									title: "Calendar",
									label: "",
									icon: Calendar,
									variant: "default",
								},
								{
									title: "Analytics",
									label: "128",
									icon: PieChartIcon,
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
						<Nav
							isCollapsed={isCollapsed}
							links={[
								{
									title: "Notifications",
									label: "128",
									icon: BellIcon,
									variant: "ghost",
								},
								{
									title: "Help Center",
									label: "",
									icon: HelpCircleIcon,
									variant: "ghost",
								},
								{
									title: "Settings",
									label: "",
									icon: SettingsIcon,
									variant: "ghost",
								},
								{
									title: "User",
									label: "",
									icon: UserIcon,
									variant: "ghost",
								},
							]}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				{children}
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
