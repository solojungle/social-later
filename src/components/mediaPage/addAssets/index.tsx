"use client";

import { MediaFormField } from "@/components/createPost/mediaFormField";
import { CancelSubmitBar } from "@/components/createPost/tabs/cancelSubmitBar";
import { FileUpload, OnProgress, uploadFile } from "@/components/fileUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileProgress, useFileUpload } from "@/hooks/use-file-upload";
import { fileSchema } from "@/schemas/new-file-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, PlusIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// These are the restrictions for the media files that can be uploaded
const mediaFileTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "video/mp4",
  "video/quicktime",
  "video/mov",
  "video/mpeg",
];
const mediaFileExtensions = {
  "": mediaFileTypes.map((fileType: string) => `.${fileType.split("/")[1]}`),
};

const UploadSchema = z.object({
  media: z.array(fileSchema(256 * 1024 * 1024 * 1024, mediaFileTypes)).min(1),
});

export function AddAssets() {
  const { id: teamId } = useSelectedTeamStore();

  const [open, setOpen] = useState(false);
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="mr-1 h-5 w-5" />
          <Folder className="h-5 w-5 lg:invisible" />
          <span className="sr-only line-clamp-1 lg:not-sr-only">
            Add Assets
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0"
        side="right"
      >
        <SheetHeader>
          <SheetTitle>Add Assets</SheetTitle>
          <SheetDescription className="mb-8">
            Upload images, videos, and other media files to your library.
          </SheetDescription>
        </SheetHeader>
        {teamId && <Content setOpen={setOpen} teamId={teamId} />}
      </SheetContent>
    </Sheet>
  );
}

function Content({
  setOpen,
  teamId,
}: {
  setOpen: (show: boolean) => void;
  teamId: string;
}) {
  const { id: userId } = useUserStore();
  const posthog = usePostHog();
  const utils = api.useUtils();
  const [loading, setLoading] = useState(false);
  const { completeMultipartUpload, createFile, fetchMultipartPresignedUrls } =
    useFileUpload();
  const [fileProgress, setFileProgress] = useState<FileProgress>({});
  const { mutateAsync: createAttachment } = api.attachment.create.useMutation({
    onSuccess() {
      utils.attachment.getAll.invalidate();
      toast.success("Successfully uploaded your assets!", {});
    },
  });

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      const filesToUpload = [...data.media];
      const mediaFiles = await Promise.all(
        filesToUpload.map((file: FileUpload) =>
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

      // Create attachments with no post
      await createAttachment(
        mediaFiles.map((file) => ({
          fileId: file.id,
          teamId,
        })),
      );

      // Capture the event in PostHog
      posthog.capture("file_upload", {
        distinctId: userId,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  type FormSchemaValues = z.infer<typeof UploadSchema>;
  const form = useForm<FormSchemaValues>({
    defaultValues: {
      media: [],
    },
    resolver: zodResolver(UploadSchema),
  });

  return (
    <Form {...form}>
      <form
        className="h-full space-y-8 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="h-full">
          <MediaFormField
            fileProgress={fileProgress}
            form={form}
            isLoading={loading}
            restrictions={{
              accept: mediaFileExtensions,
              maxFiles: 5,
              maxSize: 10 * 1024 * 1024,
              maxSizeInMB: "2MB",
            }}
            valueName="media"
          />
        </div>
        <CancelSubmitBar action="Upload Media" form={form} loading={loading} />
      </form>
    </Form>
  );
}
