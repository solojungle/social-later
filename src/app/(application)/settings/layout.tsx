"use client";

import { ResizablePanel } from "@/components/ui/resizable";

const accountNavItems = [
	{
		title: "Account",
		href: "/settings",
	},
	{
		title: "Notifications",
		href: "/settings/notifications",
	},
	// {
	// 	title: "Security",
	// 	href: "/settings/security",
	// },
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<ResizablePanel minSize={70} className="!overflow-scroll p-3 pb-48">
			<div>{children}</div>
		</ResizablePanel>
	);
}
