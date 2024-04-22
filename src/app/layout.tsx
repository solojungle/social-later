import "@/styles/globals.css";

import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
	metadataBase: new URL(env.NEXTAUTH_URL),
	icons: {
		appleTouchIcon: "/apple-touch-icon.png",
		favicon32: "/favicon-32x32.png",
		favicon16: "/favicon-16x16.png",
		safariPinnedTab: "/safari-pinned-tab.svg",
		msapplicationTileColor: "#ffffff",
		themeColor: "#ffffff",
	},
	openGraph: {
		title: "FeedFrenzy - Social Media Management Platform",
		description:
			"Powerful social media management platform for scheduling, analytics, and audience engagement.",
		siteName: "FeedFrenzy",
		images: [
			{
				url: "/og.png",
				width: 800,
				height: 600,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FeedFrenzy - Social Media Management Platform",
		description:
			"Powerful social media management platform for scheduling, analytics, and audience engagement.",
		creator: "@feedfrenzy",
		site: "@feedfrenzy",
		images: [
			{
				url: "/og.png",
				width: 800,
				height: 600,
				alt: "FeedFrenzy logo",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="font-beausite subpixel-antialiased">
				<TRPCReactProvider cookies={cookies().toString()}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</TRPCReactProvider>
				<Toaster />
			</body>
		</html>
	);
}
