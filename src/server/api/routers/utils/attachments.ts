import { db } from "@/server/db";

type AttachmentInput = {
  fileId: string;
  postId?: string | undefined;
  teamId: string;
};

export async function createAttachments(input: AttachmentInput[]) {
  const attachments = await db.attachment.createMany({
    data: input.map((attachment) => ({
      fileId: attachment.fileId,
      postId: attachment.postId,
      teamId: attachment.teamId,
    })),
  });

  return attachments;
}
