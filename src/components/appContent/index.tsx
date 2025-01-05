"use client";

import { useState } from "react";

import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";

export function isCurrentTab(path: string, url: string) {
	// Normalize the path and compare
	const formattedPath = path.split("/")[1]?.toLowerCase();
	return formattedPath === url ? "default" : "ghost";
}

export function AppContent({ children }: { children: React.ReactNode }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="flex w-full">
			<SideBar isMenuOpen={isMenuOpen} />

			<div className="flex-1 transition-all duration-200 ease-in-out">
				<TopBar toggleMenu={toggleMenu} />
				<div className="relative">{children}</div>
			</div>
		</div>
	);
}
