"use client";

import { MediaFormField } from "@/components/createPost/mediaFormField";
import { ThreadsSchema } from "@/components/createPost/tabs/threadsTab/forms/image-form";
import { Form } from "@/components/ui/form";
import { FileProgress } from "@/hooks/use-file-upload";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function VideoPreview() {
	const posthog = usePostHog();
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const utils = api.useUtils();
	const [loading, setLoading] = useState(false);
	const [fileProgress, setFileProgress] = useState<FileProgress>({});

	const mediaFileTypes = ["image/jpeg", "image/png", "image/jpg"];
	const mediaFileExtensions = {
		"": mediaFileTypes.map((fileType: string) => `.${fileType.split("/")[1]}`),
	};

	type FormSchemaValues = z.infer<typeof ThreadsSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			status: "",
			image: [],
		},
		resolver: zodResolver(ThreadsSchema),
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("video/")) {
			setVideoFile(file);
			setVideoUrl(URL.createObjectURL(file));
		}
	};

	return (
		<div className="p-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})} className="my-2 space-y-4">
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
				</form>
			</Form>
		</div>
	);
}
