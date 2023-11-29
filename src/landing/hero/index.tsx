import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="w-full bg-[url('/backgrounds/gradient.jpg')] bg-cover bg-center bg-no-repeat p-20">
			<div className="h-full w-full">
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
		</section>
	);
}
