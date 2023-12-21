import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="mx-4 flex h-screen flex-col items-center justify-center xl:mx-12">
			<div className="xs:text-[9.5vw] w-full text-[10.75vw] font-normal tracking-tight lg:text-[8.3vw]">
				<div className="grid w-full grid-cols-9 gap-0 leading-tight">
					<p className="col-span-full col-start-1">SCALE SMARTER.</p>
					<p className="col-span-full col-start-4">GROW FASTER.</p>
					<p className="col-span-5 col-start-2">WIN MORE.</p>
					<div className="col-span-full col-start-7 flex flex-col items-start justify-center gap-4 ">
						<p className="prose text-left text-lg font-normal tracking-tight">
							The first modern sales engagement platform to efficiently create
							pipeline & close more deals paired with a talent marketplace, to
							instantly hire, scale & drive revenue faster.
						</p>
						<Button variant="destructive">Begin your 14 day trial</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
