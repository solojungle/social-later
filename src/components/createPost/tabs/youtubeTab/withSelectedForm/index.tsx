"use client";

import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";
import { TitleFormField } from "@/components/createPost/titleFormField";
import { Form } from "@/components/ui/form";
import { useYouTube } from "@/hooks/use-youtube";
import { BaseYoutubeSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { SelectedPreview } from "../../selectedFiles";

export function WithSelectedForm({
  currentDate,
  profileId,
  selected,
  setOpen,
  teamId,
}: {
  currentDate: Date;
  profileId: string;
  selected?: any[];
  setOpen: (open: boolean) => void;
  teamId: string;
}) {
  const [loading, setLoading] = useState(false);
  const { id: userId } = useUserStore();
  const utils = api.useUtils();
  const posthog = usePostHog();

  const { createPost, uploadVideo } = useYouTube();

  const FormSchema = BaseYoutubeSchema.omit({
    thumbnail: true,
    video: true,
  });

  type FormSchemaValues = z.infer<typeof FormSchema>;
  const form = useForm<FormSchemaValues>({
    defaultValues: {
      date: currentDate,
      description: "",
      title: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const uploadVideoToYouTube = async (
    data: FormSchemaValues,
    videoUrl: string,
  ) => {
    const { data: result } = await uploadVideo({
      description: data.description,
      profileId,
      scheduledTime: new Date(data.date).toISOString(),
      title: data.title,
      videoUrl,
    });

    if (!result || !result.id) {
      throw new Error("Failed to upload video to YouTube");
    }

    return result.id;
  };

  const createYouTubePost = async (
    data: FormSchemaValues,
    externalPostId: string,
    mediaFiles: any[],
  ) => {
    await createPost({
      authorId: teamId,
      content: data.description || "",
      externalPostId,
      fileIds: mediaFiles.map((file) => file.id),
      profileId,
      scheduledFor: data.date || undefined,
      socialType: "youtube",
      title: data.title || "",
    });
  };

  const onSuccessfulUpload = (data: FormSchemaValues) => {
    toast.success("Successfully created your post!");
    posthog.capture("youtube_upload", {
      attachmentIncluded: true,
      distinctId: userId,
      scheduled: !!data.date,
    });
  };

  const onUploadError = (error: any) => {
    console.error("Upload error:", error);
    toast.error(
      "An error occurred while trying to upload the video. Please try again.",
    );
  };

  const onUploadComplete = () => {
    setLoading(false);
    setOpen(false);
    utils.post.invalidate();
  };

  const handleSubmit = async (data: FormSchemaValues) => {
    setLoading(true);

    if (!selected || selected.length === 0) {
      toast.error("No video selected");
      setLoading(false);
      return;
    }

    try {
      const videoId = await uploadVideoToYouTube(data, selected[0].url);
      await createYouTubePost(data, videoId, selected);
      onSuccessfulUpload(data);
    } catch (error) {
      onUploadError(error);
    } finally {
      onUploadComplete();
    }
  };

  // TODO: When mobile, user a drawer instead of a sheet
  return (
    <>
      <SelectedPreview files={selected} />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <TitleFormField form={form} maxCharCount={100} />
          <DescriptionFormField
            form={form}
            maxCharCount={5000}
            valueName="description"
          />
          <DatePickerFormField defaultDate={currentDate} form={form} />
          <CancelSubmitBar form={form} loading={loading} />
        </form>
      </Form>
    </>
  );
}
