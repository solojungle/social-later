import Hero from "./hero";
import Marquee from "./marquee";
import { NavigationMenuDemo } from "./navigationBar";
import StripePricingTable from "./stripe";

export default async function LandingPage() {
	return (
		<main className="container min-h-screen">
			<NavigationMenuDemo />
			<div className="mb-10">
				<Hero />
			</div>
			<div className="mb-10">
				<h2 className="mb-2 text-xs font-semibold uppercase">
					Trusted by thousands of companies
				</h2>
				<Marquee />
			</div>
			<StripePricingTable />
		</main>
	);
}
