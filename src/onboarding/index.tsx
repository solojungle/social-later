"use client";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ArrowUpRight } from "lucide-react";
import Confetti from "react-confetti";
import { useTimeout } from "react-use";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@/components/ui/button";

function Option({ title, description, children }: any) {
	return (
		<div className="relative mb-[8px] flex cursor-pointer select-none flex-col items-start rounded-[8px] border bg-white p-4 transition ease-out hover:border-primary">
			<div className="flex text-base font-semibold md:text-lg">{title}</div>
			<div className="mt-[2px] text-xs font-normal text-gray-600 md:text-sm">
				{description}
			</div>
			{children}
		</div>
	);
}

function OptionBadge({ children }: any) {
	return (
		// eslint-disable-next-line tailwindcss/classnames-order
		<div className="relative mt-2 flex w-auto items-center gap-0.5 rounded-lg bg-success-foreground/40 p-1 pr-1.5 text-xs font-medium text-success md:absolute md:right-4 md:top-4 md:mt-0">
			{children}
		</div>
	);
}

function OptionGroup({ title, description, children }: any) {
	return (
		<div className="mb-4 flex flex-col space-y-1 md:mx-auto md:max-w-[540px] md:pt-[48px] lg:pt-[64px] xl:pt-[88px]">
			<div className="mb-6">
				<div className="mb-2 text-2xl font-bold md:text-4xl">{title}</div>
				<div className="text-sm text-gray-600 md:text-lg">{description}</div>
			</div>
			{children}
		</div>
	);
}

function FirstPage() {
	return (
		<div className="flex flex-col justify-center p-5">
			<OptionGroup
				title="What are you planning on using FeedFrenzy for?"
				description="Select all that apply."
			>
				<Option
					title="Marketing"
					description="Hosting it on your website or including it in changelogs"
				>
					<OptionBadge>
						<ArrowUpRight className="mr-px h-4 w-4" />
						Up to 5x trial conversion
					</OptionBadge>
				</Option>
				<Option title="Sales" description="Following up with your products">
					<OptionBadge>
						<ArrowUpRight className="mr-px h-4 w-4" />
						More than 2x demo conversion
					</OptionBadge>
				</Option>
				<Option title="Product" description="Embedding it within your product">
					<OptionBadge>
						<ArrowUpRight className="mr-px h-4 w-4" />
						Up to 30% more activated users
					</OptionBadge>
				</Option>
				<Option
					title="Customer Success"
					description="Including it in your knowledge base"
				>
					<OptionBadge>
						<ArrowUpRight className="mr-px h-4 w-4" />
						Save over 3k hours onboarding
					</OptionBadge>
				</Option>
				<Option title="Training" description="Training your employees">
					<OptionBadge>
						<ArrowUpRight className="mr-px h-4 w-4" />
						Up to 10x faster than creating a video
					</OptionBadge>
				</Option>
				<Option title="Other" description="Tell us your use case" />
				<Option title="Not sure yet" />
			</OptionGroup>
			<Button
				disabled
				className="group relative h-[64px] w-full cursor-not-allowed self-center rounded-[8px] border border-gray-100 bg-gray-100 text-lg font-semibold text-gray-500 transition ease-in-out md:max-w-[540px]"
			>
				Continue
				<div className="absolute right-[16px] top-[16px] hidden md:block">
					<div className="h-[32px] w-[32px] rounded-lg bg-gray-200 text-[16px] font-medium leading-[32px] text-gray-500 transition ease-in-out">
						↩
					</div>
				</div>
			</Button>
		</div>
	);
}

function SecondPage() {
	return (
		<div className="flex flex-col justify-center p-5">
			<OptionGroup title="How many people work at your company?">
				<Option title="0 – 10" />
				<Option title="11 – 50" />
				<Option title="51 – 100" />
				<Option title="101 – 500" />
				<Option title="501 – 1000" />
				<Option title="1000+" />
			</OptionGroup>
			<Button
				disabled
				className="group relative h-[64px] w-full cursor-not-allowed self-center rounded-[8px] border border-gray-100 bg-gray-100 text-lg font-semibold text-gray-500 transition ease-in-out md:max-w-[540px]"
			>
				Continue
				<div className="absolute right-[16px] top-[16px] hidden md:block">
					<div className="h-[32px] w-[32px] rounded-lg bg-gray-200 text-[16px] font-medium leading-[32px] text-gray-500 transition ease-in-out">
						↩
					</div>
				</div>
			</Button>
		</div>
	);
}

function SuccessPage() {
	const { width = 0, height = 0 } = useWindowSize({
		initializeWithValue: false,
	});

	// after 2 seconds, stop the confetti animation
	const [showConfetti] = useTimeout(4000);

	return (
		<div className="flex flex-col justify-center p-5">
			<Confetti
				width={width}
				height={height}
				numberOfPieces={200}
				initialVelocityY={50}
				gravity={0.03}
				tweenDuration={10000}
				recycle={!showConfetti()}
			/>

			<div className="mb-4 flex flex-col space-y-1 md:mx-auto md:max-w-[540px] md:pt-[48px] lg:pt-[64px] xl:pt-[88px]">
				<CheckCircledIcon className="mb-4 h-24 w-24 self-center text-success" />
				<div className="mb-8 text-2xl font-bold">
					Congratulations! You&apos;re now ready to use FeedFrenzy!
				</div>
				<div className="mb-8">
					You&apos;ve completed the onboarding process. You can now start using
					FeedFrenzy.
				</div>
				<div className="mb-8">
					Here is contact information for our support team:
					<div className="mt-4">
						Email:{" "}
						<a href="mailto:ali.awari.0@gmail.com">ali.awari.0@gmail.com</a>
					</div>
					<div className="mt-4">
						Phone: <a href="tel:+923000000000">+923000000000</a>
					</div>
				</div>
				<div className="mb-8">
					Here is a link to our documentation:
					<div className="mt-4">
						<a href="https://feedfrenzy.com/docs">
							https://feedfrenzy.com/docs
						</a>
					</div>
				</div>
				<Button className="group relative h-[64px] w-full self-center rounded-[8px] border border-gray-100 bg-primary text-lg font-semibold text-primary-foreground transition ease-in-out md:max-w-[540px]">
					Access FeedFrenzy
					<div className="absolute right-[16px] top-[16px] hidden md:block">
						<div className="h-[32px] w-[32px] rounded-lg bg-gray-200 text-[16px] font-medium leading-[32px] text-gray-500 transition ease-in-out">
							↩
						</div>
					</div>
				</Button>
			</div>
		</div>
	);
}

export function Onboarding() {
	return <SuccessPage />;
}
