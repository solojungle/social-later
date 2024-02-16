import { KYC } from "./kyc";

export function Onboarding() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			Which of the following best describes you?
			<div className="flex space-x-4">
				<button type="button">Individual</button>
				<button type="button">Business</button>
			</div>
			<KYC />
			<div>
				<h2>Personalize your expierience</h2>
				<p>
					Tell us about your role. This will help us rpovide a tailored support
					experience
				</p>
				Whats your day to day role?
				<div>
					<button type="button">Developer</button>
					<button type="button">Designer</button>
					<button type="button">Product Manager</button>
					<button type="button">Self employed</button>
					<button type="button">Other</button>
				</div>
			</div>
			<div>
				Whats your top goal for using this platform?
				<div>
					<button type="button">Learn</button>
					<button type="button">Connect</button>
					<button type="button">Find work</button>
					<button type="button">Grow my business</button>
					<button type="button">Other</button>
				</div>
			</div>
			<div>
				Create your team name
				<input />
			</div>
			<div>
				Youre on your way! Lets get your team set up, and add a social profile
			</div>
		</div>
	);
}
