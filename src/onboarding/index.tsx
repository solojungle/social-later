import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { KYC } from "./kyc";

function Content() {
	return (
		<div className="">
			<div className="flex items-center justify-center space-x-2">
				<img src="/images/logo.png" alt="logo" className="h-8 w-8" />
				<span className="text-lg font-bold">FeedFrenzy</span>
			</div>
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

export function Onboarding() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Dialog>
				<DialogTrigger asChild>
					<Button>Add profile</Button>
				</DialogTrigger>
				<DialogContent className="min-h-[80vh] min-w-[80vw]">
					<Content />
				</DialogContent>
			</Dialog>
		</div>
	);
}
