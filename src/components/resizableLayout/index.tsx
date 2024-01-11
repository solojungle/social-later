"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
	AlertCircle,
	Archive,
	ArchiveX,
	Inbox,
	MessagesSquare,
	Send,
	ShoppingCart,
	Trash2,
	Users2,
} from "lucide-react";
import { useState } from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
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
								title: "Inbox",
								label: "128",
								icon: Inbox,
								variant: "default",
							},
							{
								title: "Sent",
								label: "",
								icon: Send,
								variant: "ghost",
							},
							{
								title: "Junk",
								label: "23",
								icon: ArchiveX,
								variant: "ghost",
							},
							{
								title: "Trash",
								label: "",
								icon: Trash2,
								variant: "ghost",
							},
							{
								title: "Archive",
								label: "",
								icon: Archive,
								variant: "ghost",
							},
						]}
					/>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Social",
								label: "972",
								icon: Users2,
								variant: "ghost",
							},
							{
								title: "Updates",
								label: "342",
								icon: AlertCircle,
								variant: "ghost",
							},
							{
								title: "Forums",
								label: "128",
								icon: MessagesSquare,
								variant: "ghost",
							},
							{
								title: "Shopping",
								label: "8",
								icon: ShoppingCart,
								variant: "ghost",
							},
							{
								title: "Promotions",
								label: "21",
								icon: Archive,
								variant: "ghost",
							},
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
					{children}
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
