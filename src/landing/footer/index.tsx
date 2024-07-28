export default function Footer() {
	return (
		<footer className="w-full flex-col justify-center bg-stone-200">
			<div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<a
						href="https://aliawari.com/"
						className="mb-4 flex items-center space-x-3 rtl:space-x-reverse sm:mb-0"
					>
						<span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
							FeedFrenzy
						</span>
					</a>
					<ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-white sm:mb-0">
						<li>
							<a href="/privacy" className="me-4 hover:underline md:me-6">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="/terms" className="me-4 hover:underline md:me-6">
								Terms of Service
							</a>
						</li>
						<li>
							<a href="/contact" className="hover:underline">
								Contact
							</a>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}
