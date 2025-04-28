"use client";

import { OnProgress, uploadFile } from "@/components/fileUpload";
import { Form } from "@/components/ui/form";
import { FileProgress, useFileUpload } from "@/hooks/use-file-upload";
import { useThreads } from "@/hooks/use-threads";
import { fileSchema, futureDateSchema } from "@/schemas/new-file-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { SelectedPreview } from "../../selectedFiles";
import { ThreadsVideoFormFields } from "../formFields";

export const ThreadsSchema = z.object({
  date: futureDateSchema(),
  status: z.string().optional(),
  video: z
    .array(fileSchema(8 * 1024 * 1024, ["video/mp4", "video/quicktime"]))
    .min(1),
});

export function ThreadsVideoForm({
  profileId,
  scheduleDate,
  selected,
  setOpen,
  teamId,
  userId,
}: {
  profileId: string;
  scheduleDate: any;
  selected?: any[];
  setOpen: any;
  teamId: string;
  userId: string;
}) {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const utils = api.useUtils();

  const { completeMultipartUpload, createFile, fetchMultipartPresignedUrls } =
    useFileUpload();
  const { createPost, createThreadsPost } = useThreads();

  type FormSchemaValues = z.infer<typeof ThreadsSchema>;
  const form = useForm<FormSchemaValues>({
    defaultValues: {
      date: scheduleDate,
      status: "",
      video: [],
    },
    resolver: zodResolver(ThreadsSchema),
  });

  const uploadMediaFiles = async (data: FormSchemaValues) => {
    const filesToUpload = [...data.video];
    return Promise.all(
      filesToUpload.map((file) =>
        uploadFile({
          completeMultipartUpload,
          createFile,
          fetchMultipartPresignedUrls,
          onProgress: OnProgress,
          setFileProgress,
          uploadedFile: file,
        }),
      ),
    );
  };

  const createInternalPost = async ({
    data,
    externalPostId,
    mediaFiles,
  }: {
    data: FormSchemaValues;
    externalPostId: string;
    mediaFiles: any[];
  }) => {
    return createPost({
      authorId: teamId,
      content: data.status,
      externalPostId,
      fileIds: mediaFiles.map((file) => file.id),
      profileId,
      scheduledFor: data.date || undefined,
      socialType: "threads",
      title: "",
    });
  };

  const onSuccessfulUpload = (date: Date) => {
    toast.success("Successfully created your post!");
    posthog.capture("threads_post", {
      attachmentIncluded: false,
      distinctId: userId,
      scheduled: !!date,
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
    try {
      const mediaFiles = await uploadMediaFiles(data);
      const threadsPostId = await createThreadsPost({
        media: mediaFiles[0],
        mediaType: "VIDEO",
        profileId,
        text: data.status,
      });
      await createInternalPost({
        data,
        externalPostId: threadsPostId,
        mediaFiles,
      });
      onSuccessfulUpload(data.date);
    } catch (error) {
      onUploadError(error);
    } finally {
      onUploadComplete();
    }
  };

  const SelectedThreadsSchema = z.object({
    date: futureDateSchema(),
    status: z.string().optional(),
  });
  type SelectedFormSchemaValues = z.infer<typeof SelectedThreadsSchema>;
  const selectedForm = useForm<SelectedFormSchemaValues>({
    defaultValues: {
      date: scheduleDate,
      status: "",
    },
    resolver: zodResolver(SelectedThreadsSchema),
  });

  const handleSubmitWithSelected = async (data: SelectedFormSchemaValues) => {
    setLoading(true);

    if (!selected || selected.length === 0) {
      toast.error("No files selected");
      setLoading(false);
      return;
    }

    try {
      const threadsPostId = await createThreadsPost({
        media: selected[0],
        mediaType: "VIDEO",
        profileId,
        text: data.status,
      });

      await createPost({
        authorId: teamId,
        content: data.status,
        externalPostId: threadsPostId,
        fileIds: selected.map((file) => file.id),
        profileId,
        scheduledFor: data.date || undefined,
        socialType: "threads",
        title: "",
      });

      onSuccessfulUpload(data.date);
    } catch (error) {
      onUploadError(error);
    } finally {
      onUploadComplete();
    }
  };

  return (
    <>
      {selected && (
        <>
          <SelectedPreview files={selected} />
          <Form {...selectedForm}>
            <form
              className="flex h-[700px] flex-col justify-between"
              onSubmit={selectedForm.handleSubmit(handleSubmitWithSelected)}
            >
              <ThreadsVideoFormFields
                fileProgress={fileProgress}
                form={selectedForm}
                loading={loading}
                scheduleDate={scheduleDate}
                selected={selected}
              />
              <CancelSubmitBar form={selectedForm} loading={loading} />
            </form>
          </Form>
        </>
      )}
      {!selected && (
        <Form {...form}>
          <form
            className="flex h-[700px] flex-col justify-between"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <ThreadsVideoFormFields
              fileProgress={fileProgress}
              form={form}
              loading={loading}
              scheduleDate={scheduleDate}
              selected={selected}
            />
            <CancelSubmitBar form={form} loading={loading} />
          </form>
        </Form>
      )}
    </>
  );
}
