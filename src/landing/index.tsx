import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

export default async function LandingPage() {
	return (
		<main className="flex flex-col items-center justify-center bg-black text-white">
			<NavigationMenu />
			<Hero />
			{/* <Marquee /> */}
			{/* <CallToAction /> */}
		</main>
	);
}
