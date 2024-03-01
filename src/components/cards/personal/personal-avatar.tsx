import { zodResolver } from "@hookform/resolvers/zod";
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
		// Check if the users image is valid
		// Create a presigned URL for the user to upload their avatar to S3
		// Create the S3 object with the user's avatar
		// Check if the user already has an avatar, if so, delete it
		// Update the database with the new avatar
		// Update the user's avatar in the store
		// Show a toast message to the user that their avatar has been updated

		const imageFile = data.image[0] as File;
		const filename = imageFile.name.split(".").shift();
		const extension = imageFile.name.split(".").pop();

		try {
			setLoading(true);

			const presignedObject = await fetchPresignedUrls();

			await axios.put(presignedObject.signedUrl, imageFile, {
				headers: {
					"Content-Type": imageFile.type,
				},
			});

			const userAvatarFile = await createFile({
				name: filename || "",
				extension: extension || "",
				key: presignedObject.key,
				size: imageFile.size,
				mime: imageFile.type,
			});

			updateUser.mutate({
				image: userAvatarFile.url,
			});

			setUserAvatar(userAvatarFile.url);
		} finally {
			setLoading(false);
		}

		toast("You submitted the following values:", {
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
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
