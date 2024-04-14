"use client";

import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

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

export function TimePickerFormField(form: any) {
	return (
		<FormField
			control={form.control}
			name="dob"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Time</FormLabel>
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
									<ClockIcon className="mr-4 h-4 w-4 opacity-50" />
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a time</span>
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
									date > new Date() || date < new Date("1900-01-01")
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
