import { EyeIcon, FlaskConical, MapIcon } from "lucide-react";

import Hero from "./hero";
import { NavigationMenu } from "./navigationMenu";

function Lay({ children }: any) {
	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-blue-700 p-4 text-white">
				<div className="container mx-auto flex items-center justify-between">
					<div className="text-xl font-bold">Social Media Management</div>
					<nav>
						<ul className="flex space-x-4">
							<li>Products</li>
							<li>Pricing</li>
							<li>Contact</li>
						</ul>
					</nav>
					<div>
						<button className="rounded bg-white px-4 py-2 text-blue-700">
							Login
						</button>
						<button className="ml-2 rounded bg-white px-4 py-2 text-blue-700">
							Sign Up
						</button>
					</div>
				</div>
			</header>
			<main>{children}</main>
			<footer className="bg-blue-700 p-4 text-center text-white">
				&copy; {new Date().getFullYear()} Social Media Management
			</footer>
		</div>
	);
}

function FullPageSection() {
	return (
		<section className="h-screen bg-stone-100 p-20">
			<h1 className="max-w-prose text-4xl font-bold">
				Social Media Management. Scheduling, Cross-posting, Analytics.
			</h1>
			<p className="mt-4">
				Join the leading platform for social media management.
			</p>
			<div className="mt-8">
				<button className="rounded bg-white px-6 py-3 text-blue-700">
					Try for Free
				</button>
				<button className="ml-4 rounded bg-white px-6 py-3 text-blue-700">
					Learn More
				</button>
			</div>
		</section>
	);
}

function Lol() {
	return (
		<>
			<FullPageSection />
			<section className="bg-stone-200 py-20 text-center">
				<h2 className="text-3xl font-bold">Plan, approve, achieve.</h2>
				<p className="mt-4">Manage all your social media tasks in one place.</p>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded bg-white p-6 shadow">
						{/* <LucideIcon name="calendar" className="mx-auto mb-4" /> */}
						<h3 className="text-xl font-bold">Plan</h3>
						<p className="mt-2">Plan your social media content effortlessly.</p>
					</div>
					<div className="rounded bg-white p-6 shadow">
						{/* <LucideIcon name="check-circle" className="mx-auto mb-4" /> */}
						<h3 className="text-xl font-bold">Approve</h3>
						<p className="mt-2">Get approvals on your posts quickly.</p>
					</div>
					<div className="rounded bg-white p-6 shadow">
						{/* <LucideIcon name="chart-bar" className="mx-auto mb-4" /> */}
						<h3 className="text-xl font-bold">Achieve</h3>
						<p className="mt-2">Achieve your social media goals.</p>
					</div>
					<div className="rounded bg-white p-6 shadow">
						{/* <LucideIcon name="layers" className="mx-auto mb-4" /> */}
						<h3 className="text-xl font-bold">Organize</h3>
						<p className="mt-2">
							Organize your social media tasks efficiently.
						</p>
					</div>
				</div>
			</section>
			<section className="bg-cyan-950 py-20 text-center">
				<h2 className="text-3xl font-bold">
					For every challenge, there's a solution.
				</h2>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded bg-gray-200 p-6 shadow">
						<h3 className="text-xl font-bold">Solution 1</h3>
						<p className="mt-2">Description of solution 1.</p>
					</div>
					<div className="rounded bg-gray-200 p-6 shadow">
						<h3 className="text-xl font-bold">Solution 2</h3>
						<p className="mt-2">Description of solution 2.</p>
					</div>
					<div className="rounded bg-gray-200 p-6 shadow">
						<h3 className="text-xl font-bold">Solution 3</h3>
						<p className="mt-2">Description of solution 3.</p>
					</div>
				</div>
			</section>
			<section className="bg-gray-50 py-20 text-center">
				<h2 className="text-3xl font-bold">
					Social media platform for everyone. Especially for you.
				</h2>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded bg-white p-6 shadow">
						<div className="mb-4 h-32 bg-gradient-to-r from-blue-400 to-purple-400" />
						<h3 className="text-xl font-bold">Agencies</h3>
						<p className="mt-2">Manage multiple clients easily.</p>
					</div>
					<div className="rounded bg-white p-6 shadow">
						<div className="mb-4 h-32 bg-gradient-to-r from-green-400 to-blue-400" />
						<h3 className="text-xl font-bold">Brands</h3>
						<p className="mt-2">Build your brand's online presence.</p>
					</div>
					<div className="rounded bg-white p-6 shadow">
						<div className="mb-4 h-32 bg-gradient-to-r from-yellow-400 to-red-400" />
						<h3 className="text-xl font-bold">Freelancers</h3>
						<p className="mt-2">Streamline your freelance work.</p>
					</div>
				</div>
			</section>
			<section className="py-20 text-center">
				<h2 className="text-3xl font-bold">
					Reviews so nice, you'll think they're fake.
				</h2>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded bg-gray-200 p-6 shadow">
						<p>
							"This platform has revolutionized our social media management!"
						</p>
						<div className="mt-4 text-sm text-gray-600">- Happy Customer</div>
					</div>
					<div className="rounded bg-gray-200 p-6 shadow">
						<p>"A must-have tool for any social media team."</p>
						<div className="mt-4 text-sm text-gray-600">- Satisfied Client</div>
					</div>
					<div className="rounded bg-gray-200 p-6 shadow">
						<p>
							"Our productivity has increased tenfold since using this tool."
						</p>
						<div className="mt-4 text-sm text-gray-600">- Thrilled User</div>
					</div>
				</div>
			</section>
			<section className="bg-gray-50 py-20 text-center">
				<h2 className="text-3xl font-bold">
					837,321 scheduled posts in the past year by users just like you.
				</h2>
				<button className="mt-8 rounded bg-blue-700 px-6 py-3 text-white">
					Get Started
				</button>
			</section>
		</>
	);
}

// Probably from arcade.software
function ProductShowCase() {
	return (
		<div className="mb-20 flex items-center justify-center">
			<img
				alt="Browser preview of the product"
				className="max-w-6xl"
				src="/images/browser-preview-min.png"
			/>
		</div>
	);
}

// What features we offer as a company
// Answers the question: Who Is This For?
function ProductOfferings() {
	return (
		<section className="h-screen w-full flex-col justify-center space-y-14 bg-stone-200 px-4 py-20 md:px-10 lg:px-44">
			<div>
				<h2 className="font-vollkorn text-6xl font-bold">
					Plan, approve, achieve.
				</h2>
				<p className="mt-4 text-lg">
					Manage all your social media tasks in one place.
				</p>
			</div>
			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<EyeIcon className="h-5 w-5" />
					</div>
					<p className="mb-3">The Visionary</p>
					<h3 className="font-vollkorn text-2xl font-bold">
						Manage the chaos.
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

export default async function LandingPage() {
	return (
		<main className="bg-stone-100">
			{/* <Lay>
				<Lol />
			</Lay> */}
			<div className="flex w-full flex-col justify-center">
				<NavigationMenu />
				<Hero />
				<ProductShowCase />
				<ProductOfferings />
			</div>
		</main>
	);
}
