import { api } from "@/trpc/server";

import { NavigationBar } from "../navigationbar";
import { StoreInitializer } from "../storeInitializer";

export async function SiteHeader() {
	const userData = await api.user.getUser.query();
	const teamsData = await api.user.getTeams.query();

	const teamsArray = teamsData.map((team) => team.team);

	// Now create a new teams array that has the properties: type, and imageFallbackInitials
	const teamsArrayWithProperties = teamsArray.map((team) => {
		return {
			...team,
			type: "team",
			imageFallbackInitials: "TT",
		};
	});

	const userWithProperties = {
		...userData,
		type: "personal",
		imageFallbackInitials: "AA",
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<StoreInitializer
				user={{ ...userWithProperties }}
				teams={teamsArrayWithProperties}
			/>
			<NavigationBar />
		</header>
	);
}
