import { DatePickerFormField } from "./datePicker";
import { TimePickerFormField } from "./timePicker";

type StatusFormFieldProps = {
	form: any;
};

export function ScheduleFormField({ form }: StatusFormFieldProps) {
	return (
		<div>
			<h2 className="mb-2 text-sm font-semibold">Schedule Post</h2>
			<div className="grid grid-cols-2 gap-4">
				<DatePickerFormField form={form} />
				<TimePickerFormField />
			</div>
		</div>
	);
}
