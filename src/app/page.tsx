import LandingPage from "@/landing";
import Footer from "@/landing/footer";

export default async function Home() {
	return (
		<div className="container mx-auto">
			<LandingPage />
			<Footer />
		</div>
	);
}
