import { Faq } from "./sections/faq";
import { FeaturesTabs } from "./sections/features";
import { Hero } from "./sections/hero";
import { Integrations } from "./sections/integrations";
import { NavigationMenu } from "./sections/navigationMenu";
import { ProductOfferings } from "./sections/offerings";
import { Pricing } from "./sections/pricing";
import { ProductShowCase } from "./sections/showCase";

export default async function LandingPage() {
	return (
		<main className="bg-stone-100 text-black">
			<div className="flex w-full flex-col justify-center">
				<NavigationMenu />
				<Hero />
				<ProductShowCase />
				<ProductOfferings />
				<FeaturesTabs />
				<Integrations />
				{/* <div className="h-96 w-full bg-stone-200" /> */}
				<Pricing />
				<Faq />
				{/* <Footer /> */}
			</div>
		</main>
	);
}
