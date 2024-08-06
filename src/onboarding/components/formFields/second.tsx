import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function SecondFormField({ form }: { form: any }) {
	const items = [
		{ id: "1", label: "0 – 10" },
		{ id: "2", label: "11 – 50" },
		{ id: "3", label: "51 – 100" },
		{ id: "4", label: "101 – 500" },
		{ id: "5", label: "501 – 1000" },
		{ id: "6", label: "1000+" },
	];

	return (
		<FormField
			control={form.control}
			name="companySize"
			render={({ field }) => (
				<FormItem className="w-full">
					<div className="mb-4">
						<FormLabel
							htmlFor="companySize"
							className="mb-2 text-2xl font-bold md:text-4xl"
						>
							How many employees does your company have?
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
