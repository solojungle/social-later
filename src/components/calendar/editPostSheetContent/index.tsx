"use client";

import { FileType } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import {
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";
import { api } from "@/trpc/react";

async function deletePost({
	internalPostId,
	accountId,
	setOpen,
	deleteInternalPost,
	deleteTwitterPost,
}: {
	internalPostId: string;
	accountId: string;
	setOpen: (open: boolean) => void;
	deleteInternalPost: any;
	deleteTwitterPost: any;
}) {
	// First we delete the twitter post via the API
	deleteTwitterPost({ internalPostId, accountId });

	// Then we delete the post from the database
	deleteInternalPost({ internalPostId });

	// Then we close the modal and sheet
	setOpen(false);
}

export function EditPostSheetContent({
	post,
	setOpen,
}: {
	post: PostWithAttachmentsSchemaValues;
	setOpen: (open: boolean) => void;
}) {
	const utils = api.useUtils();
	const { mutate: deleteTwitterPost } = api.socials.deleteTweet.useMutation({
		onSuccess: () => {
			toast.success("Successfully deleted your post.", {});
		},
	});
	const { mutate: deleteInternalPost } = api.post.delete.useMutation({
		onSuccess: () => {
			utils.post.getAll.invalidate();
		},
	});
	const [loading, setLoading] = useState(false);

	// Helper function to render attachments
	const renderAttachment = (attachment: any) => {
		if (attachment.file.type === FileType.image) {
			return (
				<img
					key={attachment.url}
					src={attachment.url}
					alt={attachment.alt || "Post content"}
					className="aspect-video w-full rounded-lg object-scale-down"
				/>
			);
		}
		if (attachment.file.type === FileType.video) {
			return (
				<video
					key={attachment.url}
					src={attachment.url}
					controls
					className="aspect-video w-full rounded-lg object-scale-down"
				>
					<track default kind="captions" srcLang="en" src="" />
				</video>
			);
		}
		return null;
	};

	return (
		<SheetContent
			className="w-[600px] !max-w-[80vw] overflow-scroll"
			side="right"
		>
			<SheetHeader>
				<SheetTitle>Post View</SheetTitle>
			</SheetHeader>
			<div className="grid gap-4 py-4">
				{/* Render multiple attachments */}
				{post.attachment && post.attachment.length > 0 && (
					<div>
						<Label>Media</Label>
						<div className="space-y-4">
							{post.attachment.map((attachment) =>
								renderAttachment(attachment),
							)}
						</div>
					</div>
				)}
				{post.content && post.content.length > 0 && (
					<div>
						<Label>Content</Label>
						<Textarea
							defaultValue={post.content}
							placeholder="Write your post content here"
							className="h-40"
						/>
					</div>
				)}
			</div>
			<SheetFooter className="flex !justify-between">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive">
							Delete Post
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								post and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								disabled={loading}
								onClick={() => {
									setLoading(true);
									deletePost({
										internalPostId: post.id,
										accountId: post.profileId,
										setOpen,
										deleteInternalPost,
										deleteTwitterPost,
									});
									setLoading(false);
								}}
							>
								{loading && (
									<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
								)}
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className="space-x-2">
					<SheetClose asChild>
						<Button type="submit" variant="secondary">
							Cancel
						</Button>
					</SheetClose>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</div>
			</SheetFooter>
		</SheetContent>
	);
}
