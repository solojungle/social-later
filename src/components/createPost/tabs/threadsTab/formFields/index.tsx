import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { MediaFormField } from "@/components/createPost/mediaFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";

const SelectedFormFields = ({ form, scheduleDate }: any) => (
  <div className="space-y-4">
    <DescriptionFormField form={form} maxCharCount={500} valueName="status" />
    <DatePickerFormField defaultDate={scheduleDate} form={form} />
  </div>
);

export const ThreadsVideoFormFields = ({
  fileProgress,
  form,
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
      <DescriptionFormField form={form} maxCharCount={500} valueName="status" />
      <MediaFormField
        fileProgress={fileProgress}
        form={form}
        isLoading={loading}
        restrictions={{
          accept: mediaFileExtensions,
          maxFiles: 1,
          maxSize: 8 * 1024 * 1024,
          maxSizeInMB: "1GB",
        }}
        valueName="video"
      />
      <DatePickerFormField defaultDate={scheduleDate} form={form} />
    </>
  );
};

export const ThreadsImageFormFields = ({
  fileProgress,
  form,
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
      <DescriptionFormField form={form} maxCharCount={500} valueName="status" />
      <MediaFormField
        fileProgress={fileProgress}
        form={form}
        isLoading={loading}
        restrictions={{
          accept: mediaFileExtensions,
          maxFiles: 1,
          maxSize: 8 * 1024 * 1024,
          maxSizeInMB: "8MB",
        }}
        valueName="image"
      />
      <DatePickerFormField defaultDate={scheduleDate} form={form} />
    </>
  );
};

export const ThreadsStatusFormFields = ({ form, scheduleDate }: any) => (
  <div className="space-y-8">
    <DescriptionFormField form={form} maxCharCount={500} valueName="status" />
    <DatePickerFormField defaultDate={scheduleDate} form={form} />
  </div>
);
