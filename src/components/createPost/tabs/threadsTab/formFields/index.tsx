import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { MediaFormField } from "@/components/createPost/mediaFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";

const SelectedFormFields = ({ form, scheduleDate }: any) => (
	<div className="space-y-4">
		<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
		<DatePickerFormField form={form} defaultDate={scheduleDate} />
	</div>
);

export const ThreadsVideoFormFields = ({
	form,
	fileProgress,
	loading,
	scheduleDate,
	selected,
}: any) => {
	if (selected) {
		return <SelectedFormFields form={form} scheduleDate={scheduleDate} />;
	}

	// These are the restrictions for the media files that can be uploaded
	const mediaFileTypes = ["video/mp4", "video/mov"];
	const mediaFileExtensions = {
		"": mediaFileTypes.map((fileType: string) => `.${fileType.split("/")[1]}`),
	};

	return (
		<>
			<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
			<MediaFormField
				valueName="video"
				form={form}
				fileProgress={fileProgress}
				restrictions={{
					maxFiles: 1,
					maxSize: 8 * 1024 * 1024,
					maxSizeInMB: "1GB",
					accept: mediaFileExtensions,
				}}
				isLoading={loading}
			/>
			<DatePickerFormField form={form} defaultDate={scheduleDate} />
		</>
	);
};

export const ThreadsImageFormFields = ({
	form,
	fileProgress,
	loading,
	scheduleDate,
	selected,
}: any) => {
	if (selected) {
		return <SelectedFormFields form={form} scheduleDate={scheduleDate} />;
	}

	// These are the restrictions for the media files that can be uploaded
	const mediaFileTypes = ["image/jpeg", "image/png", "image/jpg"];
	const mediaFileExtensions = {
		"": mediaFileTypes.map((fileType: string) => `.${fileType.split("/")[1]}`),
	};

	return (
		<>
			<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
			<MediaFormField
				valueName="image"
				form={form}
				fileProgress={fileProgress}
				restrictions={{
					maxFiles: 1,
					maxSize: 8 * 1024 * 1024,
					maxSizeInMB: "8MB",
					accept: mediaFileExtensions,
				}}
				isLoading={loading}
			/>
			<DatePickerFormField form={form} defaultDate={scheduleDate} />
		</>
	);
};

export const ThreadsStatusFormFields = ({ form, scheduleDate }: any) => (
	<div className="space-y-8">
		<DescriptionFormField form={form} valueName="status" maxCharCount={500} />
		<DatePickerFormField form={form} defaultDate={scheduleDate} />
	</div>
);
