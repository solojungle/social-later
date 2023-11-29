import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="w-full bg-[url('/backgrounds/gradient.jpg')] bg-auto bg-center bg-no-repeat p-20">
			<div>
				<h2 className="text-7xl font-bold">
					Deploy to the cloud with confidence
				</h2>
				<p className="text-lg">
					Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
					cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
					aliqua.
				</p>
			</div>
			<div>
				<Button>Get Started</Button>
			</div>
		</section>
	);
}
