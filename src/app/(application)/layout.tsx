import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { ResizableLayout } from "@/components/resizableLayout";
import { StoreInitializer } from "@/components/storeInitializer";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "FeedFrenzy",
	description: "FeedFrenzy is a social media aggregator and feed reader.",
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

interface ApplicationLayoutProps {
	children: React.ReactNode;
}

export default async function ApplicationLayout({
	children,
}: ApplicationLayoutProps) {
	async function initStore() {
		"use server";

		const userData = await api.user.getUser.query();
		const teamsData = await api.user.getTeams.query();

		const id = teamsData?.[0]?.id!;

		const socialProfilesData = await api.socials.getSocialProfiles.query({
			id,
		});
		const teamMembersData = await api.team.getMembers.query({
			id,
		});

		return { userData, teamsData, socialProfilesData, teamMembersData };
	}

	const data = await initStore();

	return (
		<div className={`h-screen font-sans ${inter.variable}`}>
			<StoreInitializer
				user={{ ...data.userData }}
				teams={data.teamsData || []}
				profiles={data.socialProfilesData || []}
				members={data.teamMembersData || []}
			/>
			<ResizableLayout navCollapsedSize={0}>{children}</ResizableLayout>
		</div>
	);
}
