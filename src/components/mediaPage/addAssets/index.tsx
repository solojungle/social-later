"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { fileSchema } from "@/schemas/new-file-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

const UploadSchema = z.object({
	media: z
		.array(
			fileSchema(256 * 1024 * 1024 * 1024, [
				"video/mp4",
				"video/mpeg",
				"video/mov",
				"image/png",
				"image/jpeg",
				"image/jpg",
				"image/gif",
			]),
		)
		.min(1),
});

function Content({ teamId }: { teamId: string }) {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();
	const [fileProgress, setFileProgress] = useState<{
		[key: string]: { [key: number]: number };
	}>({});
	const { mutateAsync: createAttachment } = api.attachment.create.useMutation();

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
		} finally {
			setLoading(false);
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
							maxSize: 2 * 1024 * 1024,
							maxSizeInMB: "2MB",
							accept: {
								"image/*": [".jpeg", ".png", ".jpg"],
							},
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

	return (
		<Sheet>
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
				<SheetTitle>Add Assets</SheetTitle>
				<SheetDescription className="mb-8">
					Upload images, videos, and other media files to your library.
				</SheetDescription>
				{teamId && <Content teamId={teamId} />}
			</SheetContent>
		</Sheet>
	);
}
