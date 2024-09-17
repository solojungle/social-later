"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, PlusIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { fileSchema } from "@/schemas/new-file-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

// These are the restrictions for the media files that can be uploaded
const mediaFileTypes = [
	"image/jpeg",
	"image/png",
	"image/jpg",
	"video/mp4",
	"video/mov",
	"video/mpeg",
];
const mediaFileExtensions = {
	"": mediaFileTypes.map((fileType: string) => `.${fileType.split("/")[1]}`),
};

const UploadSchema = z.object({
	media: z.array(fileSchema(256 * 1024 * 1024 * 1024, mediaFileTypes)).min(1),
});

function Content({
	teamId,
	setOpen,
}: {
	teamId: string;
	setOpen: (show: boolean) => void;
}) {
	const { id: userId } = useUserStore();
	const posthog = usePostHog();
	const utils = api.useUtils();
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();
	const [fileProgress, setFileProgress] = useState<{
		[key: string]: { [key: number]: number };
	}>({});
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
						uploadedFile: file,
						onProgress: OnProgress,
						fetchMultipartPresignedUrls,
						completeMultipartUpload,
						setFileProgress,
						createFile,
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
				onSubmit={form.handleSubmit(onSubmit)}
				className="h-full space-y-8 "
			>
				<div className="h-full">
					<MediaFormField
						valueName="media"
						form={form}
						fileProgress={fileProgress}
						restrictions={{
							maxFiles: 5,
							maxSize: 10 * 1024 * 1024,
							maxSizeInMB: "2MB",
							accept: mediaFileExtensions,
						}}
						isLoading={loading}
					/>
				</div>
				<CancelSubmitBar loading={loading} form={form} action="Upload Media" />
			</form>
		</Form>
	);
}

export function AddAssets() {
	const { id: teamId } = useSelectedTeamStore();

	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
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
				{teamId && <Content teamId={teamId} setOpen={setOpen} />}
			</SheetContent>
		</Sheet>
	);
}
