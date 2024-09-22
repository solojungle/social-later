import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { MediaFormField } from "@/components/createPost/mediaFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";

export const ThreadsFormFields = ({
	form,
	fileProgress,
	loading,
	scheduleDate,
}: any) => (
	<>
		<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
		<MediaFormField
			valueName="video"
			form={form}
			fileProgress={fileProgress}
			restrictions={{
				maxFiles: 1,
				maxSize: 262144 * 1024 * 1024,
				maxSizeInMB: "256GB",
				accept: {
					"video/*": [".webp", ".mov", ".mp4"],
				},
			}}
			isLoading={loading}
		/>
		<DatePickerFormField form={form} defaultDate={scheduleDate} />
	</>
);

export const ThreadsStatusFormFields = ({ form, scheduleDate }: any) => (
	<div className="space-y-8">
		<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
		<DatePickerFormField form={form} defaultDate={scheduleDate} />
	</div>
);
