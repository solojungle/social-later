import "@/styles/globals.css";

import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
	metadataBase: new URL(env.NEXTAUTH_URL),
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
				<head>
					<link
						rel="apple-touch-icon"
						sizes="152x152"
						href="/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/favicon-16x16.png"
					/>
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#ffffff" />
					<meta name="theme-color" content="#ffffff" />
				</head>
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
