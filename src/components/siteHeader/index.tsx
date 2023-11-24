import { api } from "@/trpc/server";

import { NavigationBar } from "../navigationbar";
import { StoreInitializer } from "../storeInitializer";

export async function SiteHeader() {
	const data = await api.user.getUser.query();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<StoreInitializer
				user={{
					...data,
					avatar: `https://avatar.vercel.sh/${data.name}.png`,
					avatarFallbackInitials: data.name
						?.split(" ")
						.map((n) => n[0])
						.join(""),
					type: "personal",
				}}
			/>
			<NavigationBar />
		</header>
	);
}
