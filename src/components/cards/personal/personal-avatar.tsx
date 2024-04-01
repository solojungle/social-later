import { zodResolver } from "@hookform/resolvers/zod";
import { FileType } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SingleFileSchema } from "@/schemas/file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export function PersonalAvatarCard() {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: fetchPresignedUrls } =
		api.aws.getStandardUploadPresignedUrl.useMutation();
	const { image, name, setImage: setUserAvatar } = useUserStore();
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutate: deleteFile } = api.file.delete.useMutation();
	const { mutate: deleteObject } = api.aws.deleteObject.useMutation();
	const updateUser = api.user.updateUser.useMutation();

	const defaultValues = {
		image: undefined,
	};

	// Putting them here for now
	const AvatarSchema = z.object({
		image: SingleFileSchema,
	});
	type AvatarSchemaValues = z.infer<typeof AvatarSchema>;

	const form = useForm<AvatarSchemaValues>({
		defaultValues,
		resolver: zodResolver(AvatarSchema),
	});

	const fileRef = form.register("image", { required: true });

	async function onSubmit(data: any) {
		const imageFile = data.image[0] as File;
		const filename = imageFile.name.split(".").shift();
		const extension = imageFile.name.split(".").pop();

		try {
			setLoading(true);

			if (image && image !== "" && image !== null) {
				const oldAvatarKey = image.split("/").pop();

				if (oldAvatarKey) {
					// TODO: Check if it exists in our AWS versus just being a url to another site!

					// Delete the avatar from aws
					deleteObject({ key: oldAvatarKey });

					// Delete file from our system
					deleteFile({ key: oldAvatarKey });
				}
			}

			const presignedObject = await fetchPresignedUrls({
				fileExtension: extension || "",
			});

			await axios.put(presignedObject.signedUrl, imageFile, {
				headers: {
					"Content-Type": imageFile.type,
				},
			});

			const userAvatarFile = await createFile({
				file: {
					name: filename || "",
					extension: extension || "",
					key: presignedObject.key,
					type: FileType.image,
					size: imageFile.size,
					mime: imageFile.type,
				},
			});

			updateUser.mutate({
				image: userAvatarFile.url,
			});

			setUserAvatar(userAvatarFile.url);

			toast.success("Successfully updated your avatar!", {});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<SettingsCardBase
					isLoading={loading}
					title="Avatar"
					description="This is your avatar. Click to upload a custom one from your files. Will be resized to 200x200."
					footerSubtitle="An avatar is optional but strongly recommended."
					content={
						<>
							<FormField
								control={form.control}
								name="image"
								render={() => (
									<FormItem>
										<FormLabel>File Upload</FormLabel>
										<FormControl>
											<Input id="picture" type="file" {...fileRef} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Avatar className="mr-2 h-20 w-20">
								<AvatarImage src={image} alt={name} />
								<AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
							</Avatar>
						</>
					}
				/>
			</form>
		</Form>
	);
}
