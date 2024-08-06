import { CheckCircledIcon } from "@radix-ui/react-icons";
import Confetti from "react-confetti";
import { useTimeout } from "react-use";
import { useWindowSize } from "usehooks-ts";

import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";

export function SuccessPage() {
	const { width = 0, height = 0 } = useWindowSize({
		initializeWithValue: false,
	});

	// after 2 seconds, stop the confetti animation
	const [showConfetti] = useTimeout(2500);

	return (
		<div className="flex flex-col p-5">
			<Confetti
				width={width}
				height={height}
				numberOfPieces={200}
				initialVelocityY={-5}
				gravity={0.03}
				tweenDuration={10000}
				recycle={!showConfetti()}
			/>

			<div className="mb-4 flex flex-col md:mx-auto md:max-w-[540px] md:pt-[48px] lg:pt-[64px] xl:pt-[88px]">
				<CheckCircledIcon className="mb-4 h-24 w-24 self-center text-success" />
				<div className="mb-1 text-sm font-semibold uppercase">
					Congratulations!
				</div>
				<div className="mb-8 text-2xl font-bold">
					You&apos;re now ready to use FeedFrenzy!
				</div>
				<div className="mb-12 text-lg">
					You will be redirected to the Nexus, where you can start discovering
					FeedFrenzy.
				</div>
				<Button className="group relative h-[64px] w-full justify-between self-center rounded-[8px] border border-gray-100 bg-primary text-lg font-semibold text-primary-foreground transition ease-in-out md:max-w-[540px]">
					Access FeedFrenzy
					<div className="flex h-5 w-5 items-center justify-center rounded-lg border border-border bg-primary p-5 text-primary-foreground">
						<Countdown />
					</div>
				</Button>
			</div>
		</div>
	);
}
