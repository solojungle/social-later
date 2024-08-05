import { Controller } from "react-hook-form";

import { BorderCheckbox } from "../borderCheckbox";
import { OptionGroup } from "../options";

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
		<OptionGroup
			title="How many employees does your company have?"
			description="Select one option."
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
						</BorderCheckbox>
					)}
				/>
			))}
		</OptionGroup>
	);
}
