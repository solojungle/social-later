"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
	BellIcon,
	Calendar,
	FileImage,
	HelpCircleIcon,
	PieChartIcon,
	SettingsIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import { Nav } from "./nav";
import { CollapsibleUserMenu } from "./userButton";

interface ResizableLayoutProps {
	children: React.ReactNode;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}

function isCurrentTab(path: string, url: string) {
	return path === `/${url}` ? "default" : "ghost";
}

export function ResizableLayout({
	children,
	defaultCollapsed = false,
	navCollapsedSize,
}: ResizableLayoutProps) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

	// const { id: teamId } = useSelectedTeamStore();
	// const { data } = api.socials.getTwitterAccounts.useQuery({ id: teamId });

	const path = usePathname();

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
				<ResizablePanel
					order={1}
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
									title: "Publish",
									label: "",
									icon: Calendar,
									// Check if the path matches the current path, if so set the variant to "default" else "ghost"
									variant: isCurrentTab(path, "publish"),
									url: "publish",
								},
								{
									title: "Analytics",
									label: "",
									icon: PieChartIcon,
									variant: isCurrentTab(path, "analytics"),
									url: "analytics",
								},
								{
									title: "Media Files",
									label: "",
									icon: FileImage,
									variant: "disabled",
									url: "media",
								},
							]}
						/>
						<div className="flex flex-col justify-between">
							<Nav
								isCollapsed={isCollapsed}
								links={[
									{
										title: "Notifications",
										label: "",
										icon: BellIcon,
										variant: isCurrentTab(path, "notifications"),
										url: "notifications",
									},
									{
										title: "Help Center",
										label: "",
										icon: HelpCircleIcon,
										variant: isCurrentTab(path, "help"),
										url: "help",
									},
									{
										title: "Settings",
										label: "",
										icon: SettingsIcon,
										variant: isCurrentTab(path, "settings"),
										url: "settings",
									},
								]}
							/>
							<Separator className="my-3" />
							<CollapsibleUserMenu isCollapsed={isCollapsed} />
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				{children}
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
