import { AppContent } from "@/components/appContent";
import { AuthWrapper } from "@/components/protectedPage";
import { SiteHeader } from "@/components/siteHeader";
import { getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  description: "FeedFrenzy is a social media aggregator and feed reader.",
  title: "FeedFrenzy",
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
  const session = await getServerAuthSession();
  const isAuthenticated = !!session;

  return (
    <div className={`min-h-screen font-sans ${inter.variable}`}>
      <SiteHeader />
      <AuthWrapper isAuthenticated={isAuthenticated}>
        <AppContent>{children}</AppContent>
      </AuthWrapper>
    </div>
  );
}
