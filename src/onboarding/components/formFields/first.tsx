import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
		<FormField
			control={form.control}
			name="usecase"
			render={({ field }) => (
				<FormItem className="w-full">
					<div className="mb-4">
						<FormLabel
							htmlFor="usecase"
							className="mb-2 text-2xl font-bold md:text-4xl"
						>
							What are you planning on using FeedFrenzy for?
						</FormLabel>
						<FormDescription className="text-sm text-gray-600 md:text-lg">
							Select one.
						</FormDescription>
					</div>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							{items.map((item) => (
								<label
									htmlFor={item.id}
									key={item.id}
									className="flex w-full cursor-pointer select-none items-center rounded-lg border border-border bg-background p-4 shadow-sm transition ease-out [&:has([data-state=checked])]:border-primary"
								>
									<RadioGroupItem
										value={item.id}
										id={item.id}
										className="mr-4"
									/>
									<div className="flex flex-col items-start text-foreground">
										<label
											htmlFor={item.id}
											className="flex cursor-pointer text-base font-semibold"
										>
											{item.label}
										</label>
										<label
											htmlFor={item.id}
											className="mt-[2px] cursor-pointer text-xs font-normal text-gray-600 md:text-sm"
										>
											{item.description}
										</label>
									</div>
								</label>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
