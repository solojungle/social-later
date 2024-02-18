import CallToAction from "./callToAction";
import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

export default async function LandingPage() {
	return (
		<main className="bg-black text-white">
			<NavigationMenu />
			<Hero />
			{/* <Marquee /> */}
			<CallToAction />
		</main>
	);
}
