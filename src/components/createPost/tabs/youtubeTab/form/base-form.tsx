"use client";

import { OnProgress, uploadFile } from "@/components/fileUpload";
import { Form } from "@/components/ui/form";
import { FileProgress, useFileUpload } from "@/hooks/use-file-upload";
import { useYouTube } from "@/hooks/use-youtube";
import { YouTubeFormSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { YouTubeFormFields } from "../youtubeFormFields";

export function BaseYouTubeForm({
  profileId,
  scheduleDate,
  setOpen,
  teamId,
}: {
  profileId: string;
  scheduleDate: Date;
  setOpen: any;
  teamId: string;
}) {
  const { id: userId } = useUserStore();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const utils = api.useUtils();

  const { completeMultipartUpload, createFile, fetchMultipartPresignedUrls } =
    useFileUpload();
  const { changeThumbnail, createPost, updateThumbnail, uploadVideo } =
    useYouTube();

  type FormSchemaValues = z.infer<typeof YouTubeFormSchema>;
  const form = useForm<FormSchemaValues>({
    defaultValues: {
      date: scheduleDate,
      description: "",
      thumbnail: [],
      title: "",
      video: [],
    },
    resolver: zodResolver(YouTubeFormSchema),
  });

  const uploadMediaFiles = async (data: FormSchemaValues) => {
    const filesToUpload = [...(data.thumbnail || []), ...data.video];
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

  const separateMediaFiles = (mediaFiles: any[]) => ({
    thumbnailFile: mediaFiles.find((file) => file.mime.includes("image")),
    videoFile: mediaFiles.find((file) => file.mime.includes("video")),
  });

  const uploadYouTubeVideo = async (
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
    return createPost({
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

  const handleThumbnailUpdate = async (
    thumbnailFile: any,
    videoId: string,
    postId: string,
  ) => {
    if (thumbnailFile) {
      await changeThumbnail({
        profileId,
        thumbnailUrl: thumbnailFile.url,
        videoId,
      });

      await updateThumbnail({
        postId,
        thumbnailUrl: thumbnailFile.thumbnail,
      });
    }
  };

  const onSuccessfulUpload = (data: FormSchemaValues) => {
    toast.success("Successfully created your post!");
    posthog.capture("youtube_upload", {
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
      const mediaFiles = await uploadMediaFiles(data);
      const { thumbnailFile, videoFile } = separateMediaFiles(mediaFiles);
      const videoId = await uploadYouTubeVideo(data, videoFile);
      const post = await createYouTubePost(data, videoId, mediaFiles);
      await handleThumbnailUpdate(thumbnailFile, videoId, post.id);

      onSuccessfulUpload(data);
    } catch (error) {
      onUploadError(error);
    } finally {
      onUploadComplete();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
        <YouTubeFormFields
          fileProgress={fileProgress}
          form={form}
          loading={loading}
          scheduleDate={scheduleDate}
        />
        <CancelSubmitBar form={form} loading={loading} />
      </form>
    </Form>
  );
}
