import { Button } from "@/components/ui/button";

export default function CallToAction() {
	return (
		<section className="mx-4 flex h-screen flex-col items-center justify-center xl:mx-12">
			<h2 className="mb-8 flex flex-col text-center text-[30px] xl:text-[48px]">
				<span>Activate a suite of modern sales tools &amp;</span>
				<span className="serif italic">avoid sprawling tech stacks.</span>
			</h2>
			<Button variant="secondary">Get Started Today</Button>
		</section>
	);
}
