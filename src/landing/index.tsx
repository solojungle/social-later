import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

export default async function LandingPage() {
	return (
		<main className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
			<div className="flex w-full flex-col items-center justify-center text-white">
				<NavigationMenu />
				<Hero />
			</div>
		</main>
	);
}
