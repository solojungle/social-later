export default function Marquee() {
	return (
		<section className="flex w-full flex-col items-center py-10">
			<h2 className="mb-8 text-xs tracking-widest text-muted-foreground">
				OUR NETWORK OF THE MOST INNOVATIVE
			</h2>
			<div className="mx-auto flex max-w-5xl select-none gap-20 overflow-x-hidden">
				<ul className="flex min-w-full shrink-0 animate-marquee content-around items-center gap-20 [--duration:15s] md:[--duration:20s] ">
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/armory.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/kong.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/orb.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/patch.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/popsql.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/jam.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
				</ul>
				<ul className="flex min-w-full shrink-0 animate-marquee content-around items-center gap-20 [--duration:15s] md:[--duration:20s]">
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/armory.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/kong.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/orb.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/patch.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/popsql.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/jam.svg" alt="Google" className="h-10" />
					</li>
					<li className="leading-[0px] !text-slate-400">
						<img src="/media/codecombat.svg" alt="Google" className="h-10" />
					</li>
				</ul>
			</div>
		</section>
	);
}
