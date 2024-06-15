import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

export default async function LandingPage() {
	return (
		<main
			className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,orange)]
			dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,orange)]
		"
		>
			<div className="flex w-full flex-col justify-center">
				<NavigationMenu />
				<Hero />
			</div>
		</main>
	);
}
