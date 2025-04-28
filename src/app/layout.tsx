import "@/styles/globals.css";
import PostHogPageView from "@/components/postHog/page-view";
import { PosthogProvider } from "@/components/postHog/providers";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";
import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";

export const metadata = {
  icons: {
    appleTouchIcon: "/apple-touch-icon.png",
    favicon16: "/favicon-16x16.png",
    favicon32: "/favicon-32x32.png",
    msapplicationTileColor: "#ffffff",
    safariPinnedTab: "/safari-pinned-tab.svg",
    themeColor: "#ffffff",
  },
  metadataBase: new URL(env.NEXTAUTH_URL),
  openGraph: {
    description:
      "Powerful social media management platform for scheduling, analytics, and audience engagement.",
    images: [
      {
        height: 600,
        url: "/og.png",
        width: 800,
      },
    ],
    locale: "en_US",
    siteName: "FeedFrenzy",
    title: "FeedFrenzy - Social Media Management Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@feedfrenzy",
    description:
      "Powerful social media management platform for scheduling, analytics, and audience engagement.",
    images: [
      {
        alt: "FeedFrenzy logo",
        height: 600,
        url: "/og.png",
        width: 800,
      },
    ],
    site: "@feedfrenzy",
    title: "FeedFrenzy - Social Media Management Platform",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-beausite subpixel-antialiased">
        <TRPCReactProvider cookies={cookies().toString()}>
          <PosthogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <PostHogPageView />
              <Toaster />
            </ThemeProvider>
          </PosthogProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
