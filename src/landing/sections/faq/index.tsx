import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/landing/components/styledSection";

export function Faq() {
	return (
		<Section variant="secondary">
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
		</Section>
	);
}
