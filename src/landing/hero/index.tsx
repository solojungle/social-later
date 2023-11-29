import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="mb-5 flex flex-1 flex-col rounded-lg bg-[url('/backgrounds/gradient.jpg')] bg-cover bg-center bg-no-repeat p-14">
			<div className="h-full">
				<h2 className="mb-5 text-5xl font-bold sm:text-7xl">
					Deploy to the cloud with confidence
				</h2>
				<p className="mb-10 text-lg">
					Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
					cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
					aliqua.
				</p>
			</div>
			<div>
				<Button>Start for free</Button>
			</div>
			<div>
				<p className="mt-5 text-xs">No credit card required.</p>
			</div>
		</section>
	);
}
