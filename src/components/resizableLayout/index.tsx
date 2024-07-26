"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
	BellIcon,
	Calendar,
	FolderIcon,
	HelpCircleIcon,
	HomeIcon,
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
import { useSelectedTeamStore } from "@/stores/selected-team";

import { Separator } from "../ui/separator";
import { Nav } from "./nav";
import { CollapsibleUserMenu } from "./userButton";

interface ResizableLayoutProps {
	children: React.ReactNode;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}

export function isCurrentTab(path: string, url: string) {
	// Only get stuff before first slash
	const formattedPath = path.split("/")[1]?.toLowerCase();

	return `${formattedPath}` === `${url}` ? "default" : "ghost";
}

export function ResizableLayout({
	children,
	defaultCollapsed = false,
	navCollapsedSize,
}: ResizableLayoutProps) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);
	const { id: teamId } = useSelectedTeamStore();
	const path = usePathname();

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
				<ResizablePanel
					id="nav"
					order={1}
					collapsedSize={navCollapsedSize}
					collapsible
					minSize={15}
					defaultSize={20}
					maxSize={20}
					onCollapse={() => setIsCollapsed(true)}
					onExpand={() => setIsCollapsed(false)}
					className={cn(
						isCollapsed &&
							"min-w-[50px] transition-all duration-300 ease-in-out",
					)}
				>
					<div className="flex h-full flex-col">
						<div className="flex items-center space-x-2 px-4 pt-3">
							<img src="/images/logo.png" alt="logo" className="w-8" />
							{!isCollapsed && (
								<span className="text-lg font-bold">FeedFrenzy</span>
							)}
						</div>
						<Separator className="my-3" />
						<div className="flex h-full flex-col justify-between pb-5">
							<Nav
								isCollapsed={isCollapsed}
								links={[
									{
										title: "Nexus",
										label: "",
										icon: HomeIcon,
										// Check if the path matches the current path, if so set the variant to "default" else "ghost"
										variant: isCurrentTab(path, "nexus"),
										url: "nexus",
									},
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
										icon: FolderIcon,
										variant: isCurrentTab(path, "media"),
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
											// variant: isCurrentTab(path, "notifications"),
											variant: "disabled",
											url: "notifications",
										},
										{
											title: "Help Center",
											label: "",
											icon: HelpCircleIcon,
											// variant: isCurrentTab(path, "help"),
											variant: "disabled",
											url: "help/en",
										},
										{
											title: "Settings",
											label: "",
											icon: SettingsIcon,
											variant: teamId
												? isCurrentTab(path, "teams")
												: "disabled",
											url: `teams/${teamId}/settings`,
										},
									]}
								/>
								<Separator className="my-3" />
								<CollapsibleUserMenu isCollapsed={isCollapsed} />
							</div>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				{children}
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
