import Hero from "./hero";
import Marquee from "./marquee";
import { NavigationMenuDemo } from "./navigationBar";
import StripePricingTable from "./stripe";

export default async function LandingPage() {
	return (
		<main className="mb-14">
			<div className="flex min-h-screen flex-col space-y-2 py-2">
				<NavigationMenuDemo />
				<div className="flex flex-1 flex-col">
					<Hero />
					<h2 className="mb-2 text-center text-xs font-semibold uppercase">
						Trusted by thousands of companies
					</h2>
					<Marquee />
				</div>
			</div>
			<div>
				<h2 className="text-md mb-5 text-center font-semibold uppercase">
					Pricing
				</h2>
				<StripePricingTable />
			</div>
		</main>
	);
}
