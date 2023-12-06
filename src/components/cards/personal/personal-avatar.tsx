import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { UserSchema, UserSchemaValues } from "@/schemas/user-schema";
import { useUserStore } from "@/stores/user";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export function PersonalAvatarCard() {
	const { image, imageFallbackInitials, name } = useUserStore();

	const defaultValues = {
		image,
	};

	const form = useForm<UserSchemaValues>({
		resolver: zodResolver(UserSchema.pick({ image: true })),
		defaultValues,
	});

	function onSubmit(data: UserSchemaValues) {
		toast({
			title: "You submitted the following values:",
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
					title="Avatar"
					description="This is your avatar. Click to upload a custom one from your files."
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
											<Input id="picture" type="file" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Avatar className="mr-2 h-20 w-20">
								<AvatarImage src={image} alt={name} />
								<AvatarFallback>{imageFallbackInitials}</AvatarFallback>
							</Avatar>
						</>
					}
				/>
			</form>
		</Form>
	);
}
