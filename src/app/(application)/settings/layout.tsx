import { type Metadata } from "next";

import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Forms",
	description: "Advanced form example using react-hook-form and Zod.",
};

const accountNavItems = [
	{
		title: "Account",
		href: "/settings/account",
	},
	{
		title: "Notifications",
		href: "/settings/notifications",
	},
	{
		title: "Security",
		href: "/settings/security",
	},
];

const teamNavItems = [
	{
		title: "General",
		href: "/settings/general",
	},
	{
		title: "Billing",
		href: "/settings/billing",
	},
	{
		title: "Members",
		href: "/settings/members",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<div className="hidden space-y-6 p-10 pb-16 md:block">
			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">
					Manage your account settings and set e-mail preferences.
				</p>
			</div>
			<Separator className="my-6" />
			<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="-mx-4 lg:w-1/5">
					<Sidebar teamItems={teamNavItems} accountItems={accountNavItems} />
				</aside>
				<div className="flex-1 lg:max-w-4xl">{children}</div>
			</div>
		</div>
	);
}
