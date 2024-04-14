import { useRef, useState } from "react";

import { DatePickerFormField } from "./datePicker";
import { TimePickerFormField } from "./timePicker";

type ToolbarProps = {
	textareaRef: React.RefObject<HTMLTextAreaElement>;
	charCount: number;
	maxCharCount: number;
};

type StatusFormFieldProps = {
	form: any;
};

export function ScheduleFormField({ form }: StatusFormFieldProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [charCount, setCharCount] = useState(0);
	const [maxCharCount] = useState(200);

	const handleTextareaChange = () => {
		if (textareaRef.current) {
			setCharCount(textareaRef.current.value.length);
		}
	};

	return (
		<div>
			<h2 className="mb-2 text-sm font-semibold">Schedule Post</h2>
			<div className="grid grid-cols-2 gap-4">
				<DatePickerFormField />
				<TimePickerFormField />
				{/* <FormField
					control={form.control}
					name="time"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Time</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
			</div>
		</div>
	);
}
