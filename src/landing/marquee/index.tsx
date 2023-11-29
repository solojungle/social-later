export default function Marquee() {
	return (
		<section className="w-full bg-black px-4 py-10 md:px-10">
			<div className="mx-auto flex max-w-5xl select-none gap-20 overflow-x-hidden">
				<ul className="animate-marquee flex min-w-full shrink-0 content-around items-center gap-20 [--duration:15s] md:[--duration:20s]">
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/armory.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/kong.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/orb.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/patch.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/popsql.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/jam.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
				</ul>
				<ul className="flex min-w-full shrink-0 animate-marquee content-around items-center gap-20 [--duration:15s] md:[--duration:20s]">
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/armory.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/kong.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/orb.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/patch.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/popsql.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/jam.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-200">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
				</ul>
			</div>
		</section>
	);
}
