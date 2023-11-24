import { api } from "@/trpc/server";

import { NavigationBar } from "../navigationbar";
import { StoreInitializer } from "../storeInitializer";

export async function SiteHeader() {
	const userData = await api.user.getUser.query();
	const teamsData = await api.user.getTeams.query();

	// Now we will pull every "team" value from the teams array and put it into a new array that does not have the "team" key
	const teamsArray = teamsData.map((team) => team.team);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<StoreInitializer
				user={{
					...userData,
					imageFallbackInitials: "AA",
					type: "personal",
				}}
				teams={...teamsArray}
			/>
			<NavigationBar />
		</header>
	);
}
