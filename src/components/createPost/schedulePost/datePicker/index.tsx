"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFormFieldProps = {
	defaultDate: Date;
	form: any;
};

export function DatePickerFormField({
	defaultDate,
	form,
}: DatePickerFormFieldProps) {
	return (
		<FormField
			control={form.control}
			name="date"
			defaultValue={defaultDate}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Date</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start pl-3 font-normal",
										!field.value && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-4 h-4 w-4 opacity-50" />
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								disabled={(date) =>
									date < new Date(new Date().setHours(0, 0, 0, 0))
								}
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
