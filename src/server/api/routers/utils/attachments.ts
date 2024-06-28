import { db } from "@/server/db";

type AttachmentInput = {
	teamId: string;
	fileId: string;
	postId?: string | undefined;
};

export async function createAttachments(input: AttachmentInput[]) {
	const attachments = await db.attachment.createMany({
		data: input.map((attachment) => ({
			teamId: attachment.teamId,
			fileId: attachment.fileId,
			postId: attachment.postId,
		})),
	});

	return attachments;
}
