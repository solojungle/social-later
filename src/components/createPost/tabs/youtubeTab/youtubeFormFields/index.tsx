import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { MediaFormField } from "@/components/createPost/mediaFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";
import { TitleFormField } from "@/components/createPost/titleFormField";

export const YouTubeFormFields = ({
  fileProgress,
  form,
  loading,
  scheduleDate,
}: any) => (
  <>
    <TitleFormField form={form} maxCharCount={100} />
    <DescriptionFormField
      form={form}
      maxCharCount={5000}
      valueName="description"
    />
    <MediaFormField
      fileProgress={fileProgress}
      form={form}
      isLoading={loading}
      restrictions={{
        accept: {
          "video/*": [".webp", ".mov", ".mp4"],
        },
        maxFiles: 1,
        maxSize: 262144 * 1024 * 1024,
        maxSizeInMB: "256GB",
      }}
      valueName="video"
    />
    <MediaFormField
      fileProgress={fileProgress}
      form={form}
      isLoading={loading}
      restrictions={{
        accept: {
          "image/*": [".jpeg", ".png", ".jpg"],
        },
        maxFiles: 1,
        maxSize: 2 * 1024 * 1024,
        maxSizeInMB: "2MB",
      }}
      valueName="thumbnail"
    />
    <DatePickerFormField defaultDate={scheduleDate} form={form} />
  </>
);
