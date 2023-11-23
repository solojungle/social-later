import { NavigationBar } from "../navigationbar";
import { StoreInitializer } from "../storeInitializer";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<StoreInitializer
				user={{
					id: "1",
					name: "JohnCena",
					email: "ali@seriesfi.com",
					url: "V1StGXR8_Z5jdHi6B-myT",
					type: "personal",
					avatar: "https://avatar.vercel.sh/shirt.png",
					avatarFallbackInitials: "JC",
				}}
			/>
			<NavigationBar />
		</header>
	);
}
