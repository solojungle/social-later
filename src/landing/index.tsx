import {
	ChevronRight,
	CornerLeftDown,
	EyeIcon,
	FlaskConical,
	MapIcon,
} from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

// function Lay({ children }: any) {
// 	return (
// 		<div className="min-h-screen bg-gray-100">
// 			<header className="bg-blue-700 p-4 text-white">
// 				<div className="container mx-auto flex items-center justify-between">
// 					<div className="text-xl font-bold">Social Media Management</div>
// 					<nav>
// 						<ul className="flex space-x-4">
// 							<li>Products</li>
// 							<li>Pricing</li>
// 							<li>Contact</li>
// 						</ul>
// 					</nav>
// 					<div>
// 						<button className="rounded bg-white px-4 py-2 text-blue-700">
// 							Login
// 						</button>
// 						<button className="ml-2 rounded bg-white px-4 py-2 text-blue-700">
// 							Sign Up
// 						</button>
// 					</div>
// 				</div>
// 			</header>
// 			<main>{children}</main>
// 			<footer className="bg-blue-700 p-4 text-center text-white">
// 				&copy; {new Date().getFullYear()} Social Media Management
// 			</footer>
// 		</div>
// 	);
// }

// function FullPageSection() {
// 	return (
// 		<section className="h-screen bg-stone-100 p-20">
// 			<h1 className="max-w-prose text-4xl font-bold">
// 				Social Media Management. Scheduling, Cross-posting, Analytics.
// 			</h1>
// 			<p className="mt-4">
// 				Join the leading platform for social media management.
// 			</p>
// 			<div className="mt-8">
// 				<button className="rounded bg-white px-6 py-3 text-blue-700">
// 					Try for Free
// 				</button>
// 				<button className="ml-4 rounded bg-white px-6 py-3 text-blue-700">
// 					Learn More
// 				</button>
// 			</div>
// 		</section>
// 	);
// }

// function Lol() {
// 	return (
// 		<>
// 			<FullPageSection />
// 			<section className="bg-stone-200 py-20 text-center">
// 				<h2 className="text-3xl font-bold">Plan, approve, achieve.</h2>
// 				<p className="mt-4">Manage all your social media tasks in one place.</p>
// 				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
// 					<div className="rounded bg-white p-6 shadow">
// 						{/* <LucideIcon name="calendar" className="mx-auto mb-4" /> */}
// 						<h3 className="text-xl font-bold">Plan</h3>
// 						<p className="mt-2">Plan your social media content effortlessly.</p>
// 					</div>
// 					<div className="rounded bg-white p-6 shadow">
// 						{/* <LucideIcon name="check-circle" className="mx-auto mb-4" /> */}
// 						<h3 className="text-xl font-bold">Approve</h3>
// 						<p className="mt-2">Get approvals on your posts quickly.</p>
// 					</div>
// 					<div className="rounded bg-white p-6 shadow">
// 						{/* <LucideIcon name="chart-bar" className="mx-auto mb-4" /> */}
// 						<h3 className="text-xl font-bold">Achieve</h3>
// 						<p className="mt-2">Achieve your social media goals.</p>
// 					</div>
// 					<div className="rounded bg-white p-6 shadow">
// 						{/* <LucideIcon name="layers" className="mx-auto mb-4" /> */}
// 						<h3 className="text-xl font-bold">Organize</h3>
// 						<p className="mt-2">
// 							Organize your social media tasks efficiently.
// 						</p>
// 					</div>
// 				</div>
// 			</section>
// 			<section className="bg-cyan-950 py-20 text-center">
// 				<h2 className="text-3xl font-bold">
// 					For every challenge, there's a solution.
// 				</h2>
// 				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<h3 className="text-xl font-bold">Solution 1</h3>
// 						<p className="mt-2">Description of solution 1.</p>
// 					</div>
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<h3 className="text-xl font-bold">Solution 2</h3>
// 						<p className="mt-2">Description of solution 2.</p>
// 					</div>
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<h3 className="text-xl font-bold">Solution 3</h3>
// 						<p className="mt-2">Description of solution 3.</p>
// 					</div>
// 				</div>
// 			</section>
// 			<section className="bg-gray-50 py-20 text-center">
// 				<h2 className="text-3xl font-bold">
// 					Social media platform for everyone. Especially for you.
// 				</h2>
// 				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
// 					<div className="rounded bg-white p-6 shadow">
// 						<div className="mb-4 h-32 bg-gradient-to-r from-blue-400 to-purple-400" />
// 						<h3 className="text-xl font-bold">Agencies</h3>
// 						<p className="mt-2">Manage multiple clients easily.</p>
// 					</div>
// 					<div className="rounded bg-white p-6 shadow">
// 						<div className="mb-4 h-32 bg-gradient-to-r from-green-400 to-blue-400" />
// 						<h3 className="text-xl font-bold">Brands</h3>
// 						<p className="mt-2">Build your brand's online presence.</p>
// 					</div>
// 					<div className="rounded bg-white p-6 shadow">
// 						<div className="mb-4 h-32 bg-gradient-to-r from-yellow-400 to-red-400" />
// 						<h3 className="text-xl font-bold">Freelancers</h3>
// 						<p className="mt-2">Streamline your freelance work.</p>
// 					</div>
// 				</div>
// 			</section>
// 			<section className="py-20 text-center">
// 				<h2 className="text-3xl font-bold">
// 					Reviews so nice, you'll think they're fake.
// 				</h2>
// 				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<p>
// 							"This platform has revolutionized our social media management!"
// 						</p>
// 						<div className="mt-4 text-sm text-gray-600">- Happy Customer</div>
// 					</div>
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<p>"A must-have tool for any social media team."</p>
// 						<div className="mt-4 text-sm text-gray-600">- Satisfied Client</div>
// 					</div>
// 					<div className="rounded bg-gray-200 p-6 shadow">
// 						<p>
// 							"Our productivity has increased tenfold since using this tool."
// 						</p>
// 						<div className="mt-4 text-sm text-gray-600">- Thrilled User</div>
// 					</div>
// 				</div>
// 			</section>
// 			<section className="bg-gray-50 py-20 text-center">
// 				<h2 className="text-3xl font-bold">
// 					837,321 scheduled posts in the past year by users just like you.
// 				</h2>
// 				<button className="mt-8 rounded bg-blue-700 px-6 py-3 text-white">
// 					Get Started
// 				</button>
// 			</section>
// 		</>
// 	);
// }

function ProductShowCase() {
	return (
		<section className="mx-5 flex items-center justify-center">
			<div className="relative flex w-full max-w-6xl flex-col items-center justify-center">
				<div className="absolute right-0 top-[-30px] flex rotate-3 items-center space-x-2 text-stone-400">
					<CornerLeftDown className="mt-2 h-4 w-4" />
					<p className="text-sm">Play with this arcade!</p>
				</div>
				<div className="flex h-[80vh] w-full overflow-hidden rounded-xl border border-border shadow-lg">
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
		</section>
	);
}

function Faq() {
	return (
		<section className="w-full flex-col justify-center bg-stone-200 px-4 py-20 md:px-10 lg:px-44">
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
					<AccordionTrigger className="text-xl">Refund policy</AccordionTrigger>
					<AccordionContent className="text-lg">
						Your subscription is billed monthly or annually in advance based on
						your selected plan. Please note that all payments are
						non-refundable. We do not offer refunds, either partial or full, for
						pre-paid subscription fees. This applies if you choose to terminate
						your subscription early, downgrade, or discontinue use of our
						services.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<div className="flex space-x-1">
				<p>Still have questions?</p>
				<a className="underline" href="mailto:contact@feedfrenzy.co">
					Contact Us
				</a>
			</div>
		</section>
	);
}

// What features we offer as a company
// Answers the question: Who Is This For?
function ProductOfferings() {
	return (
		<section className="w-full flex-col justify-center space-y-14 bg-stone-100 px-4 py-20 md:px-10 lg:px-44">
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
		</section>
	);
}

function Pricing() {
	return (
		<section className="w-full flex-col justify-center bg-stone-100 px-4 py-20 md:px-10 lg:px-44">
			<h2 className="mb-8 max-w-3xl font-vollkorn text-6xl font-bold">
				Simple pricing, that allows you to test the waters.
			</h2>
			<p className="max-w-xl leading-normal">
				Plan content, approve, schedule, and analyze posts across all your
				platforms to deliver the best marketing results. Social media
				shouldn&apos;t be an extreme sport.
			</p>
			<div>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
						<h3 className="mb-6 font-vollkorn text-xl">
							Questionnaire Package
						</h3>
						<p className="mt-2 font-vollkorn text-6xl">$18.67</p>
						<div className="mt-6 space-y-6">
							<ul className="list-inside list-disc text-base">
								<li>1 user</li>
								<li>1 social account</li>
								<li>10 scheduled posts</li>
								<li>Basic analytics</li>
							</ul>
							<Button className="flex items-center">
								<span className="mr-1">Purchase Package </span>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
						<div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-t from-cyan-950 to-cyan-900 px-2 py-1 font-vollkorn text-white">
							Most Popular
						</div>
						<h3 className="mb-6 font-vollkorn text-xl">Survey Package</h3>
						<p className="mt-2 font-vollkorn text-6xl">$29.99</p>
						<div className="mt-6 space-y-6">
							<ul className="list-inside list-disc text-base">
								<li>1 user</li>
								<li>3 social accounts</li>
								<li>30 scheduled posts</li>
								<li>Advanced analytics</li>
							</ul>
							<Button className="flex items-center">
								<span className="mr-1">Purchase Package </span>
								<ChevronRight className="h-4 w-4" />
							</Button>

							<Separator className="bg-muted-foreground" />

							<p className="text-sm">
								You submit a questionnaire, and we will send it to 10
								hand-picked participants who match your requested attributes
								and/or experience.
							</p>
						</div>
					</div>

					<div className="rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
						<h3 className="mb-6 font-vollkorn text-xl">Clarity Bundle</h3>
						<p className="mt-2 font-vollkorn text-6xl">$49.99</p>
						<div className="mt-6 space-y-6">
							<ul className="list-inside list-disc text-base">
								<li>1 user</li>
								<li>5 social accounts</li>
								<li>50 scheduled posts</li>
								<li>Advanced analytics</li>
							</ul>
							<Button className="flex items-center">
								<span className="mr-1">Purchase Package </span>
								<ChevronRight className="h-4 w-4" />
							</Button>

							<Separator className="bg-muted-foreground" />

							<p className="text-sm">
								Get access to both the questionnaire and interview package.
								Allow you to get initial survey responses and follow up with
								one-to-one meetings.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
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
				<div className="h-96 bg-stone-200" />
				<div className="relative h-96 bg-teal-950">
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent opacity-50" />
				</div>
				<Pricing />
				<Faq />
				{/* <Footer /> */}
			</div>
		</main>
	);
}
