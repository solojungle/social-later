import { Calendar, CircleCheckIcon, PieChart } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "@/landing/components/styledSection";

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

export function FeaturesTabs() {
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
