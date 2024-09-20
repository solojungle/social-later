"use client";

import Link from "next/link";
import { Suspense, useState } from "react";

import { cn } from "@/lib/utils";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { AddTeamMember } from "../addTeamMember";
import { CreatePost } from "../createPost";
import { FeedbackForm } from "../feedbackButton";
import { NotificationCenter } from "../notificationCenter";
import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { MainMenu } from "./middayNavbar";
import { CollapsibleUserMenu } from "./userMenu";

export function isCurrentTab(path: string, url: string) {
	// Normalize the path and compare
	const formattedPath = path.split("/")[1]?.toLowerCase();
	return formattedPath === url ? "default" : "ghost";
}

export function ResizableLayout({ children }: { children: React.ReactNode }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { currentProfileId: profileId } = useSocialProfilesStore();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="flex h-full min-h-screen w-full overflow-y-scroll">
			<aside
				className={cn(
					"sticky top-0 z-40 hidden h-screen shrink-0 flex-col items-center justify-between border border-b-0 border-l-0 border-t-0 border-border bg-background px-2 pb-4 transition-all duration-200 ease-in-out md:flex md:translate-x-0",
					isMenuOpen && "flex translate-x-0",
					!isMenuOpen && "-translate-x-full",
				)}
			>
				<div className="flex w-full flex-col items-center justify-center">
					<div className="mt-4">
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

			<div className={cn("flex-1 transition-all duration-200 ease-in-out")}>
				<div className="pb-8">
					<div className="flex items-center justify-between border-b border-border p-3">
						<div className="flex items-center gap-2 sm:gap-x-6">
							<Button
								size="icon"
								variant="outline"
								onClick={toggleMenu}
								className="md:hidden"
							>
								<InterfaceIcons.Menu />
							</Button>
							<SocialProfileSwitcher />
							<AddTeamMember />
						</div>
						<div className="flex items-center space-x-2">
							<CreatePost profileId={profileId} scheduleDate={new Date()} />
							<FeedbackForm />
							<NotificationCenter />
						</div>
					</div>
					<div className="relative">{children}</div>
				</div>
			</div>
		</div>
	);
}
