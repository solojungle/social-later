import { z } from "zod";

// Helper function for file schema
function fileSchema(size: number, acceptedTypes: string[]) {
	const mb = Math.floor(size / (1024 * 1024));

	// z.any is used because anything else will prevent it from being uploaded (it limits whats passed to backend)
	return z
		.any()
		.refine(
			(file) => acceptedTypes.includes(file.file?.type as string),
			"File type is not supported.",
		)
		.refine(
			(file) => file.file?.size ?? size >= 0,
			`Max file size is ${mb}MB.`,
		);
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

export const YouTubeFormSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().optional(),
		thumbnail: z
			.array(fileSchema(2 * 1024 * 1024, ["image/png", "image/jpeg"]))
			.optional(),
		video: z
			.array(
				fileSchema(256 * 1024 * 1024 * 1024, [
					"video/mp4",
					"video/mpeg",
					"video/mov",
				]),
			)
			.min(1),
		date: futureDateSchema(),
	})
	.refine((data) => !!data.date, {
		message: "Date is required",
		path: ["date"],
	});
