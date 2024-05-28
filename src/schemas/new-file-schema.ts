import { z } from "zod";

// Helper function for file schema
export function fileSchema(size: number, acceptedTypes: string[]) {
	const mb = Math.floor(size / (1024 * 1024));
	return z.object({
		file: z.object({
			type: z.string().refine((type) => acceptedTypes.includes(type), {
				message: "File type is not supported.",
			}),
			size: z.number().refine((fileSize) => fileSize <= size, {
				message: `Max file size is ${mb}MB.`,
			}),
		}),
	});
}

// Helper function for future date schema
function futureDateSchema() {
	return z.date().refine(
		(date) => {
			const now = new Date();
			date.setHours(0, 0, 0, 0);
			now.setHours(0, 0, 0, 0);
			return date >= now;
		},
		{
			message: "Date must be in the future",
		},
	);
}

// YouTubeFormSchema
export const YouTubeFormSchema = z
	.object({
		title: z.string().min(1, { message: "Title is required" }),
		description: z.string().min(1, { message: "Description is required" }),
		thumbnail: z
			.array(fileSchema(2 * 1024 * 1024, ["image/png", "image/jpeg"]))
			.min(1, { message: "At least one thumbnail is required" }),
		date: futureDateSchema(),
		video: z.array(fileSchema(256000000000, ["video/*"])).min(1, {
			message: "At least one video is required",
		}),
	})
	.refine((data) => !!data.date, {
		message: "Date is required",
		path: ["date"],
	});
