import {
	Calendar,
	ChevronRight,
	CircleCheckIcon,
	CornerLeftDown,
	EyeIcon,
	FlaskConical,
	MapIcon,
	PieChart,
} from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";
import { Section } from "./styledSection";

function ProductShowCase() {
	return (
		<Section>
			<div className="relative flex w-full flex-col items-center justify-center">
				<div className="absolute right-0 top-[-30px] flex rotate-3 items-center space-x-2 text-stone-400">
					<CornerLeftDown className="mt-2 h-4 w-4" />
					<p className="text-sm">Play with this arcade!</p>
				</div>
				<div className="flex h-[30vh] w-full overflow-hidden rounded-xl border-border sm:h-[70vh] sm:border sm:shadow-lg">
					<iframe
						src="https://demo.arcade.software/AEWm4UM96Qph59yj2Z2I?embed&show_copy_link=true"
						title="FeedFrenzy"
						loading="lazy"
						allowFullScreen
						allow="clipboard-write"
						referrerPolicy="strict-origin-when-cross-origin"
						className="grow"
					/>
				</div>
			</div>
		</Section>
	);
}

function Faq() {
	return (
		<Section variant="secondary">
			<div className="container">
				<h2 className="mb-14 font-vollkorn text-6xl font-bold">
					Frequently Asked Questions
				</h2>
				<Accordion type="single" collapsible className="mb-8 w-full">
					<AccordionItem value="item-1" className="!border-black">
						<AccordionTrigger className="text-xl">
							What social media channels (accounts) can I manage?
						</AccordionTrigger>
						<AccordionContent className="text-lg">
							Facebook, Twitter, Instagram, LinkedIn, Pinterest, and Google
							Business Profile.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2" className="!border-black">
						<AccordionTrigger className="text-xl">
							Can I schedule Instagram posts directly from FeedFrenzy?
						</AccordionTrigger>
						<AccordionContent className="text-lg">
							Yes, you can. We support direct scheduling of single image posts,
							Reels, Carousels, and Stories.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3" className="!border-black">
						<AccordionTrigger className="text-xl">
							Can I reschedule, move, copy, or duplicate posts to other social
							media accounts?
						</AccordionTrigger>
						<AccordionContent className="text-lg">Yes</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4" className="!border-black">
						<AccordionTrigger className="text-xl">
							Can I create content without scheduling it?
						</AccordionTrigger>
						<AccordionContent className="text-lg">Yes</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-5" className="!border-black">
						<AccordionTrigger className="text-xl">
							Refund policy
						</AccordionTrigger>
						<AccordionContent className="text-lg">
							Your subscription is billed monthly or annually in advance based
							on your selected plan. Please note that all payments are
							non-refundable. We do not offer refunds, either partial or full,
							for pre-paid subscription fees. This applies if you choose to
							terminate your subscription early, downgrade, or discontinue use
							of our services.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<div className="flex space-x-1">
					<p>Still have questions?</p>
					<a className="underline" href="mailto:contact@feedfrenzy.co">
						Contact Us
					</a>
				</div>
			</div>
		</Section>
	);
}

// What features we offer as a company
// Answers the question: Who Is This For?
function ProductOfferings() {
	return (
		<Section>
			<div>
				<h2 className="font-vollkorn text-6xl font-bold">
					Plan, approve, achieve.
				</h2>
				<p className="mt-2 text-lg">
					Made specifically for the type of people who want to be
				</p>
			</div>
			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<EyeIcon className="h-5 w-5" />
					</div>
					<p className="mb-3">The Visionary</p>
					<h3 className="font-vollkorn text-2xl font-bold">
						Managing the chaos.
					</h3>
					<p className="mt-2">
						This product is for the professional who sees the big picture across
						multiple platforms. You&apos;re ready to streamline your workflow
						and amplify your impact with a unified solution that matches your
						vision.
					</p>
				</div>

				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<MapIcon className="h-5 w-5" />
					</div>
					<p className="mb-3">The Strategist</p>
					<h3 className="font-vollkorn text-2xl font-bold">
						Seeing all the things.
					</h3>
					<p className="mt-2">
						For the analyst who thrives on metrics and performance. You value a
						centralized hub for planning, approving, and analyzing content,
						turning insights into action across all your social channels.
					</p>
				</div>

				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<FlaskConical className="h-5 w-5" />
					</div>
					<p className="mb-3">The Innovator</p>
					<h3 className="font-vollkorn text-2xl font-bold">Shaping a brand.</h3>
					<p className="mt-2">
						Our platform is designed for the innovator who&apos;s always one
						step ahead. You&apos;re expanding your digital footprint and need
						advanced features, scalability, and comprehensive analytics to fuel
						your growth.
					</p>
				</div>
			</div>
		</Section>
	);
}

function ListedItem({ children }: any) {
	return (
		<li className="mb-2 flex items-start">
			<CircleCheckIcon className="mr-2 mt-1 h-4 w-4 shrink-0" />
			<span>{children}</span>
		</li>
	);
}

interface CheckListProps {
	content: string[];
}

function CheckList({ content }: CheckListProps) {
	return (
		<ul className="max-w-md list-inside space-y-1 pt-4 text-base">
			{content.map((item, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<ListedItem key={index}>{item}</ListedItem>
			))}
		</ul>
	);
}

interface FeatureTabContentProps {
	image: string;
	title: string;
	description: string;
	children?: React.ReactNode;
}

function FeatureTabContent({
	image,
	title,
	description,
	children,
}: FeatureTabContentProps) {
	return (
		<div className="grid grid-cols-1 gap-24 xl:grid-cols-2">
			<img
				src={image}
				className="aspect-video w-full shrink-0 rounded-lg border border-border"
				alt={`A preview of the FeedFrenzy platform with a ${title} title and a description that reads: ${description}`}
			/>
			<div className="flex flex-col">
				<h2 className="mb-2 font-vollkorn text-6xl font-bold">{title}</h2>
				<p className="max-w-xl leading-normal">{description}</p>
				{children}
			</div>
		</div>
	);
}

function StyledTabsTrigger({ children, ...props }: any) {
	return (
		<TabsTrigger
			className="group justify-start p-0 duration-0 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:shadow-none"
			{...props}
		>
			{children}
		</TabsTrigger>
	);
}

function FeaturesTabs() {
	return (
		<Section variant="color">
			<Tabs defaultValue="publishing" className="container">
				<TabsList className="mb-0 grid h-full w-full grid-cols-2 grid-rows-2 gap-4 bg-transparent text-white sm:mb-14 sm:grid-cols-5 sm:grid-rows-1">
					{/* <StyledTabsTrigger value="engagement">
						<div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full duration-200 group-hover:bg-teal-600 group-data-[state=active]:bg-teal-600">
							<MessagesSquareIcon className="h-5 shrink-0" />
						</div>
						<span>Engagement</span>
					</StyledTabsTrigger> */}
					<StyledTabsTrigger value="publishing">
						<div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full duration-200 group-hover:bg-purple-600 group-data-[state=active]:bg-purple-600">
							<Calendar className="h-5 shrink-0" />
						</div>
						<span>Publishing</span>
					</StyledTabsTrigger>
					<StyledTabsTrigger value="analytics">
						<div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full duration-200 group-hover:bg-orange-600 group-data-[state=active]:bg-orange-600">
							<PieChart className="h-5 shrink-0" />
						</div>
						<span>Analytics</span>
					</StyledTabsTrigger>
					{/* <StyledTabsTrigger value="listening">
						<div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full duration-200 group-hover:bg-blue-600 group-data-[state=active]:bg-blue-600">
							<AudioLinesIcon className="h-5 shrink-0" />
						</div>
						<span>Listening</span>
					</StyledTabsTrigger> */}
					{/* <StyledTabsTrigger value="advocacy">
						<div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full duration-200 group-hover:bg-red-600 group-data-[state=active]:bg-red-600">
							<HandHelping className="h-5 shrink-0" />
						</div>
						<span>Advocacy</span>
					</StyledTabsTrigger> */}
				</TabsList>
				<TabsContent value="engagement">
					<FeatureTabContent
						image="/images/browser-preview-min.png"
						title="Extend your social reach"
						description="Give your employees a simple way to share curated content across their social networks."
					>
						<CheckList
							content={[
								"Resolve customer questions faster with AI-enhanced agent replies",
								"Control a smarter inbox with automated routing and chatbots",
								"Prioritize your most important messages with AI-powered message classifications",
							]}
						/>
					</FeatureTabContent>
				</TabsContent>
				<TabsContent value="publishing">
					<FeatureTabContent
						image="/images/publish-preview-min.png"
						title="Plan and strengthen your publishing"
						description="Schedule, organize and deliver content faster with AI-powered workflows."
					>
						<CheckList
							content={[
								"Determine the best times to post for engagement and impressions automatically",
								"Generate engaging captions in seconds with AI to spend more time on campaign strategy",
								"Schedule content for Instagram, X (formerly known as Twitter), Facebook, LinkedIn, TikTok and more",
							]}
						/>
					</FeatureTabContent>
				</TabsContent>
				<TabsContent value="analytics">
					<FeatureTabContent
						image="/images/analytics-preview-min.png"
						title="Prove the ROI of your social efforts"
						description="Drive business impact across teams with rich social data and dashboards."
					>
						<CheckList
							content={[
								"Automate and accelerate your data collection and distribution",
								"Create tailored reports that align with your business needs",
								"Find key learnings from your performance data with AI-powered analyst insights",
							]}
						/>
					</FeatureTabContent>
				</TabsContent>
				<TabsContent value="listening">
					<FeatureTabContent
						image="/images/browser-preview-min.png"
						title="Discover essential insights"
						description="Uncover key learnings from millions of unfiltered thoughts, feelings and opinions to enhance your current strategy and guide future action."
					>
						<CheckList
							content={[
								"Automatically sift through billions of data points to zero in on trends, insights and key learnings",
								"Generate AI summaries of long-form messages to quickly and easily understand insights",
								"Surface notable conversation trends in your key topics with AI-powered sentence insights",
							]}
						/>
					</FeatureTabContent>
				</TabsContent>
				<TabsContent value="advocacy">
					<FeatureTabContent
						image="/images/browser-preview-min.png"
						title="Extend your social reach"
						description="Give your employees a simple way to share curated content across their social networks."
					>
						<CheckList
							content={[
								"Automatically generate message ideas so your team can share a variety of content",
								"Compile content into newsletters or broadcasts to target specific audiences within your organization",
								"Connect results to leads, web traffic, event registrations and more",
							]}
						/>
					</FeatureTabContent>
				</TabsContent>
			</Tabs>
		</Section>
	);
}

function Integrations() {
	return (
		<Section variant="color" className="relative">
			<div className="container grid grid-cols-1 gap-24 xl:grid-cols-2">
				<div>
					<h2 className="mb-8 max-w-3xl font-vollkorn text-6xl font-bold">
						Oh, we&apos;re very social
					</h2>
					<p className="mb-8 max-w-xl leading-normal">
						FeedFrenzy builds and maintains strong network partnerships and
						integrations to help you unify your customer touch points and keep
						pace with changes in the social landscape.
					</p>
					<a className="text-lg underline">See all integrations</a>
				</div>
				<img
					src="/images/integrations.png"
					className="w-full max-w-sm self-center shadow-lg"
					alt="Logos of the following companies: Facebook, Twitter, Instagram, LinkedIn, Pinterest, Google Business Profile, TikTok, Snapchat, YouTube, Reddit, Tumblr, and more."
				/>
			</div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent opacity-50" />
		</Section>
	);
}

function Pricing() {
	return (
		<Section>
			<div className="container">
				<h2 className="mb-8 max-w-3xl font-vollkorn text-6xl font-bold">
					Simple pricing, that allows you to test the waters.
				</h2>
				<p className="max-w-xl leading-normal">
					Plan content, approve, schedule, and analyze posts across all your
					platforms to deliver the best marketing results. Social media
					shouldn&apos;t be an extreme sport.
				</p>
				<div>
					<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
							<h3 className="mb-6 font-vollkorn text-xl">
								Questionnaire Package
							</h3>
							<p className="mt-2 font-vollkorn text-6xl">$9.97</p>
							<div className="mt-6 space-y-6">
								<ul className="list-inside list-disc text-base">
									<li>1 user</li>
									<li>1 social account</li>
									<li>10 scheduled posts</li>
									<li>Basic analytics</li>
								</ul>
								<a href="/login" className="flex items-center">
									<Button className="flex items-center">
										<span className="mr-1">Sign up</span>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</a>
							</div>
						</div>

						<div className="relative overflow-hidden rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
							<div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-t from-cyan-950 to-cyan-900 px-2 py-1 font-vollkorn text-white">
								Most Popular
							</div>
							<h3 className="mb-6 font-vollkorn text-xl">Survey Package</h3>
							<p className="mt-2 font-vollkorn text-6xl">$19.97</p>
							<div className="mt-6 space-y-6">
								<ul className="list-inside list-disc text-base">
									<li>1 user</li>
									<li>3 social accounts</li>
									<li>30 scheduled posts</li>
									<li>Advanced analytics</li>
								</ul>
								<a href="/login" className="flex items-center">
									<Button className="flex items-center">
										<span className="mr-1">Sign up</span>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</a>

								<Separator className="bg-muted-foreground" />

								<p className="text-sm">
									You submit a questionnaire, and we will send it to 10
									hand-picked participants who match your requested attributes
									and/or experience.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}

export default async function LandingPage() {
	return (
		<main className="bg-stone-100 text-black">
			{/* <Lay>
				<Lol />
			</Lay> */}
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
