import { getServerAuthSession } from "@/server/auth";

import { InvitesPageContent } from "./content";

export default async function InvitesPage() {
	const session = await getServerAuthSession();

	return <InvitesPageContent isLoggedIn={!!session} />;
}
