import { Onboarding } from "@/onboarding";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await getServerAuthSession();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    redirect(`/login`);
  }

  return <Onboarding />;
}
