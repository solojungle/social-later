import { Separator } from "@/components/ui/separator";

function HeaderText({ id, children }: any) {
	return (
		<h2 id={id} className="mb-2 text-lg font-semibold uppercase">
			{children}
		</h2>
	);
}

// TODO: Not a priority right now
// function TableOfContents() {
// 	return (
// 		<nav className="mb-6">
// 			<h3 className="mb-2 text-xl font-bold">Table of Contents</h3>
// 			<ul className="ml-6 list-decimal space-y-2 text-sm uppercase">
// 				<li>
// 					<a href="#introduction" className="text-blue-500 hover:underline">
// 						Introduction
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#company-information"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Company Information
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#services-provided"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Services Provided
// 					</a>
// 				</li>
// 				<li>
// 					<a href="#user-accounts" className="text-blue-500 hover:underline">
// 						User Accounts
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#payment-and-billing"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Payment and Billing
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#subscription-and-termination"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Subscription and Termination
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#intellectual-property"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Intellectual Property
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#limitation-of-liability"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Limitation of Liability and Disclaimers
// 					</a>
// 				</li>
// 				<li>
// 					<a href="#user-conduct" className="text-blue-500 hover:underline">
// 						User Conduct and Prohibited Use
// 					</a>
// 				</li>
// 				<li>
// 					<a href="#privacy-and-data" className="text-blue-500 hover:underline">
// 						Privacy and Data
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#modifications-to-terms"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Modifications to the Terms
// 					</a>
// 				</li>
// 				<li>
// 					<a
// 						href="#dispute-resolution"
// 						className="text-blue-500 hover:underline"
// 					>
// 						Dispute Resolution
// 					</a>
// 				</li>
// 				<li>
// 					<a href="#governing-law" className="text-blue-500 hover:underline">
// 						Governing Law
// 					</a>
// 				</li>
// 			</ul>
// 		</nav>
// 	);
// }

export function TermsAndConditions() {
	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<h1 className="mb-4 text-3xl font-bold">Terms and Conditions</h1>
			<p>Last updated September 17, 2024</p>

			<Separator />

			<section>
				<HeaderText id="#introduction">1. Introduction</HeaderText>
				<p>
					Welcome to Feed Frenzy. By accessing or using our services, you agree
					to comply with and be bound by the following terms and conditions.
					Please read them carefully. If you do not agree to these terms, please
					do not use our services.
				</p>
			</section>

			<section>
				<HeaderText>2. Company Information</HeaderText>
				<p>
					Feed Frenzy is operated by an individual, and the official contact for
					inquiries is{" "}
					<a
						href="mailto:support@feedfrenzy.co"
						className="text-blue-500 hover:underline"
					>
						support@feedfrenzy.co
					</a>
					.
				</p>
			</section>

			<section>
				<HeaderText>3. Services Provided</HeaderText>
				<p>
					Feed Frenzy allows users to integrate multiple social media accounts,
					manage teams, and upload content. The services are available without
					geographical restrictions and are provided in two tiers.
				</p>
			</section>

			<section>
				<HeaderText>4. User Accounts</HeaderText>
				<ul className="ml-6 list-disc space-y-2">
					<li>Users must create an account to access our services.</li>
					<li>There are no age restrictions for creating an account.</li>
					<li>Multiple accounts per user or business are allowed.</li>
				</ul>
			</section>

			<section>
				<HeaderText>5. Payment and Billing</HeaderText>
				<ul className="ml-6 list-disc space-y-2">
					<li>Payments for services are processed via Stripe.</li>
					<li>Billing is conducted monthly, with no free trials available.</li>
					<li>
						Feed Frenzy reserves the right to refuse service in case of missed
						or late payments.
					</li>
					<li>
						Refunds will only be issued if the user is unable to access the
						service. No refunds will be provided for any other reason.
					</li>
				</ul>
			</section>

			<section>
				<HeaderText>6. Subscription and Termination</HeaderText>
				<ul className="ml-6 list-disc space-y-2">
					<li>
						Users may cancel their subscription at any time without incurring
						penalties.
					</li>
					<li>
						Upon termination of an account, no further actions will be taken
						regarding user data; it will remain as is.
					</li>
					<li>
						Feed Frenzy reserves the right to terminate accounts that violate
						the terms outlined in this agreement.
					</li>
				</ul>
			</section>

			<section>
				<HeaderText>7. Intellectual Property</HeaderText>
				<ul className="ml-6 list-disc space-y-2">
					<li>
						Users retain full ownership of the content they upload to Feed
						Frenzy.
					</li>
					<li>
						Feed Frenzy provides services for both personal and commercial use,
						with no restrictions on the scope of use by users.
					</li>
				</ul>
			</section>

			<section>
				<HeaderText>8. Limitation of Liability and Disclaimers</HeaderText>
				<p>
					Feed Frenzy shall not be liable for any service interruptions, data
					loss, or damages incurred while using the platform. No warranties are
					provided for the service. The service is provided &apos;as-is&apos;,
					and use is at the users own risk.
				</p>
			</section>

			<section>
				<HeaderText>9. User Conduct and Prohibited Use</HeaderText>
				<p>
					Feed Frenzy reserves the right to suspend or ban any account found to
					be in violation of these terms.
				</p>
			</section>

			<section>
				<HeaderText>10. Privacy and Data</HeaderText>
				<p>
					Feed Frenzy does not handle user data. Any privacy concerns or issues
					should be directed to third-party services used in conjunction with
					the platform. A separate privacy policy governs the handling of
					personal data. Feed Frenzy is not compliant with GDPR, CCPA, or any
					other specific data protection laws.
				</p>
			</section>

			<section>
				<HeaderText>11. Modifications to the Terms</HeaderText>
				<p>
					Feed Frenzy reserves the right to modify these terms at any time
					without notifying users directly. Users must accept the updated terms
					and conditions to continue using the platform after changes are made.
				</p>
			</section>

			<section>
				<HeaderText>12. Dispute Resolution</HeaderText>
				<p>
					Any disputes that arise will be resolved through the least expensive
					available method, such as arbitration or small claims court. All
					disputes will be handled in Passaic County, New Jersey, USA.
				</p>
			</section>

			<section>
				<HeaderText>13. Governing Law</HeaderText>
				<p>
					These terms and conditions are governed by the laws of New Jersey,
					USA.
				</p>
			</section>

			<Separator />

			<section>
				<p>If you have any questions about these Terms, please contact us.</p>
			</section>
		</div>
	);
}
