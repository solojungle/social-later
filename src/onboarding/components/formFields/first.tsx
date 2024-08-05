import { Controller } from "react-hook-form";

import { BorderCheckbox } from "../borderCheckbox";
import { OptionGroup } from "../options";

export function FirstFormField({ form }: any) {
	const items = [
		{
			id: "1",
			label: "Marketing",
			description: "Hosting it on your website or including it in changelogs",
			badge: "Up to 5x trial conversion",
		},
		{
			id: "2",
			label: "Sales",
			description: "Following up with your products",
			badge: "More than 2x demo conversion",
		},
		{
			id: "3",
			label: "Product",
			description: "Embedding it within your product",
			badge: "Up to 30% more activated users",
		},
		{
			id: "4",
			label: "Customer Success",
			description: "Including it in your knowledge base",
			badge: "Save over 3k hours onboarding",
		},
		{
			id: "5",
			label: "Training",
			description: "Training your employees",
			badge: "Up to 10x faster than creating a video",
		},
		{
			id: "6",
			label: "Other",
			description: "Tell us your use case",
		},
		{
			id: "7",
			label: "Not sure yet",
		},
	];

	return (
		<OptionGroup
			title="What are you planning on using FeedFrenzy for?"
			description="Select all that apply."
		>
			{items.map((item) => (
				<Controller
					key={item.id}
					control={form.control}
					name="companySize"
					render={({ field }) => (
						<BorderCheckbox
							checked={field.value === item.id}
							onCheckedChange={(checked) => {
								if (checked) {
									field.onChange(item.id);
								}
							}}
						>
							<div className="flex flex-col items-start text-foreground">
								<span className="flex text-base font-semibold">
									{item.label}
								</span>
							</div>
							<div className="mt-[2px] text-xs font-normal text-gray-600 md:text-sm">
								{item.description}
							</div>
						</BorderCheckbox>
					)}
				/>
			))}
		</OptionGroup>
	);
}
