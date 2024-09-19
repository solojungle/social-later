import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { MediaFormField } from "@/components/createPost/mediaFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";
import { TitleFormField } from "@/components/createPost/titleFormField";

export const YouTubeFormFields = ({
	form,
	fileProgress,
	loading,
	scheduleDate,
}: any) => (
	<>
		<TitleFormField maxCharCount={100} form={form} />
		<DescriptionFormField
			form={form}
			valueName="description"
			maxCharCount={5000}
		/>
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
		<MediaFormField
			valueName="thumbnail"
			form={form}
			fileProgress={fileProgress}
			restrictions={{
				maxFiles: 1,
				maxSize: 2 * 1024 * 1024,
				maxSizeInMB: "2MB",
				accept: {
					"image/*": [".jpeg", ".png", ".jpg"],
				},
			}}
			isLoading={loading}
		/>
		<DatePickerFormField form={form} defaultDate={scheduleDate} />
	</>
);
