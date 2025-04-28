"use client";

import { Form } from "@/components/ui/form";
import { useThreads } from "@/hooks/use-threads";
import { futureDateSchema } from "@/schemas/new-file-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { ThreadsStatusFormFields } from "../formFields";

export const ThreadsSchema = z.object({
  date: futureDateSchema(),
  status: z.string().min(1),
});

export function ThreadsStatusForm({
  profileId,
  scheduleDate,
  setOpen,
  teamId,
  userId,
}: {
  profileId: string;
  scheduleDate: any;
  setOpen: any;
  teamId: string;
  userId: string;
}) {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();

  const { createPost, createThreadsPost } = useThreads();

  type FormSchemaValues = z.infer<typeof ThreadsSchema>;
  const form = useForm<FormSchemaValues>({
    defaultValues: {
      date: scheduleDate,
      status: "",
    },
    resolver: zodResolver(ThreadsSchema),
  });

  const createInternalPost = async (
    data: FormSchemaValues,
    externalPostId: string,
  ) => {
    return createPost({
      authorId: teamId,
      content: data.status,
      externalPostId,
      profileId,
      scheduledFor: data.date || undefined,
      socialType: "threads",
      title: "",
    });
  };

  // const onSuccessfulUpload = (data: FormSchemaValues) => {
  const onSuccessfulUpload = (data: FormSchemaValues) => {
    toast.success("Successfully created your post!");
    posthog.capture("threads_post", {
      attachmentIncluded: false,
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
    try {
      const threadsPostId = await createThreadsPost({
        mediaType: "TEXT",
        profileId,
        text: data.status,
      });
      await createInternalPost(data, threadsPostId);
      onSuccessfulUpload(data);
    } catch (error) {
      onUploadError(error);
    } finally {
      onUploadComplete();
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex h-[700px] flex-col justify-between"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <ThreadsStatusFormFields form={form} scheduleDate={scheduleDate} />
        <CancelSubmitBar form={form} loading={loading} />
      </form>
    </Form>
  );
}
