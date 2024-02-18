"use client";

import { ResizablePanel } from "@/components/ui/resizable";

// export const metadata: Metadata = {
// 	title: "Forms",
// 	description: "Advanced form example using react-hook-form and Zod.",
// };

interface SettingsLayoutProps {
	children: React.ReactNode;
	params: { id: string };
}

export default function SettingsLayout({
	children,
	params,
}: SettingsLayoutProps) {
	const { id } = params;

	const accountNavItems = [
		{
			title: "Notifications",
			href: `/teams/${id}/settings/notifications`,
		},
	];

	const teamNavItems = [
		{
			title: "General",
			href: `/teams/${id}/settings`,
		},
		{
			title: "Billing",
			href: `/teams/${id}/settings/billing`,
		},
		{
			title: "Members",
			href: `/teams/${id}/settings/members`,
		},
		// {
		// 	title: "Security",
		// 	href: `/teams/${id}/settings/security`,
		// },
	];

	return (
		// <div className="space-y-6 p-4 pb-16 sm:p-10 md:block">
		// 	<div className="space-y-0.5">
		// 		<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
		// 		<p className="text-muted-foreground">
		// 			Manage your account settings and set e-mail preferences.
		// 		</p>
		// 	</div>
		// 	<Separator className="my-6" />
		// 	<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		// 		<aside className="-mx-4 lg:w-1/5">
		// 			<Sidebar teamItems={teamNavItems} accountItems={accountNavItems} />
		// 		</aside>
		// 		<div className="flex-1 lg:max-w-4xl">{children}</div>
		// 	</div>
		// </div>
		<ResizablePanel minSize={70} className="!overflow-scroll p-3 pb-48">
			{children}
		</ResizablePanel>
	);
}
