import { KYC } from "./kyc";

export function Onboarding() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			Which of the following best describes you?
			<div className="flex space-x-4">
				<button>Individual</button>
				<button>Business</button>
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
					<button>Developer</button>
					<button>Designer</button>
					<button>Product Manager</button>
					<button>Self employed</button>
					<button>Other</button>
				</div>
			</div>
			<div>
				Whats your top goal for using this platform?
				<div>
					<button>Learn</button>
					<button>Connect</button>
					<button>Find work</button>
					<button>Grow my business</button>
					<button>Other</button>
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
