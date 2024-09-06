import { redirect } from "next/navigation";

import { Onboarding } from "@/onboarding";
import { getServerAuthSession } from "@/server/auth";

export default async function OnboardingPage() {
	const session = await getServerAuthSession();
	const isAuthenticated = !!session;

	if (!isAuthenticated) {
		redirect(`/login`);
	}

	return <Onboarding />;
}
