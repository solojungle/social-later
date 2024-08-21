"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import Link from "next/link";
import { Suspense } from "react";

import { AddTeamMember } from "../addTeamMember";
import { FeedbackForm } from "../feedbackButton";
import { NotificationCenter } from "../notificationCenter";
import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { InterfaceIcons } from "../ui/icons";
import { MainMenu } from "./middayNavbar";
import { CollapsibleUserMenu } from "./userMenu";

export function isCurrentTab(path: string, url: string) {
	// Only get stuff before first slash
	const formattedPath = path.split("/")[1]?.toLowerCase();

	return `${formattedPath}` === `${url}` ? "default" : "ghost";
}

export function ResizableLayout({ children }: any) {
	// const { id: teamId } = useSelectedTeamStore();
	// const path = usePathname();

	return (
		<TooltipProvider delayDuration={0}>
			<aside className="fixed top-0 z-40 ml-4 hidden h-screen shrink-0 flex-col items-center justify-between pb-4 md:flex">
				<div className="flex flex-col items-center justify-center">
					<div className="todesktop:mt-[35px] mt-4">
						<Link href="/nexus">
							<InterfaceIcons.LogoSmall />
						</Link>
					</div>
					<MainMenu />
				</div>
				<Suspense>
					<CollapsibleUserMenu />
				</Suspense>
			</aside>

			<div className="pb-8 md:ml-[80px]">
				<div className="flex items-center justify-between border-b border-border px-3 py-4">
					<div className="flex items-center space-x-6">
						<SocialProfileSwitcher />
						<AddTeamMember />
					</div>
					<div className="flex items-center space-x-2">
						<FeedbackForm />
						<NotificationCenter />
					</div>
				</div>
				<div className="relative">{children}</div>
			</div>
		</TooltipProvider>
	);
}
