import { Section } from "@/landing/components/styledSection";

export default function Footer() {
	return (
		<footer className="">
			<Section className="!py-6" variant="secondary">
				<ul className="flex items-center text-sm font-medium">
					<li>
						<a href="/privacy" className="me-4 hover:underline md:me-6">
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="/terms" className="me-4 hover:underline md:me-6">
							Terms and Conditions
						</a>
					</li>
					<li>
						<a href="mailto:support@feedfrenzy.co" className="hover:underline">
							Contact Us
						</a>
					</li>
				</ul>
			</Section>
		</footer>
	);
}
