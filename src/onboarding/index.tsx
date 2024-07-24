import { ArrowUpRight } from "lucide-react";

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
		<div className="bg-success-foreground/40 text-success relative mt-2 flex w-auto items-center gap-0.5 rounded-lg p-1 pr-1.5 text-xs font-medium md:absolute md:right-4 md:top-4 md:mt-0">
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

export function Onboarding() {
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
