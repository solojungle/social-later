import BackButton from "@/components/backButton";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { getServerAuthSession } from "@/server/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  description: "Sign in to your account to continue.",
  title: "Authentication",
};

export default async function AuthenticationPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/nexus");
  }

  return (
    <div className="h-screen">
      <div className="container relative grid h-full flex-col items-center justify-center p-10 lg:max-w-none lg:grid-cols-2 lg:p-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 h-screen bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 25%), linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 25%), url('/backgrounds/image-mesh-gradient-2.png')",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img
              alt="logo"
              className="mr-2 h-8 w-8 rounded-lg"
              src="/images/logo.png"
            />
            <span>FeedFrenzy</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Its been a game-changer for our agency, increasing our
                efficiency and enabling us to elevate our social media presence
                to new heights.&rdquo;
              </p>
              <footer className="text-sm">Ali Awari</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex h-full flex-col lg:p-8">
          <BackButton />
          <div className="mx-auto flex h-full w-full grow flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="mb-8 flex flex-col space-y-2 text-start">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back. Sign into your account below.
              </h1>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-xs text-muted-foreground">
              <span>By clicking continue, you agree to our </span>
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href="/terms"
              >
                Terms of Service
              </Link>
              <span> and </span>
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
