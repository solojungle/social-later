// dependencies
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
import OpenAI from "openai";

// Initialize clients
const s3Client = new S3Client({});
const openai = new OpenAI();

export const handler = async (event) => {
	try {
		// Get bucket and key from event
		const srcBucket = event.Records[0].s3.bucket.name;
		const srcKey = decodeURIComponent(
			event.Records[0].s3.object.key.replace(/\+/g, " "),
		);

		// Skip if not a video file
		if (!srcKey.match(/\.(mp4|mov|avi|wmv)$/i)) {
			console.log("Not a video file, skipping");
			return;
		}

		// Check if transcription already exists
		const transcriptionKey = `${srcKey}.transcription.json`;
		try {
			await s3Client.send(
				new HeadObjectCommand({
					Bucket: srcBucket,
					Key: transcriptionKey,
				}),
			);
			console.log("Transcription already exists, skipping");
			return;
		} catch (error) {
			// File doesn't exist, continue processing
		}

		// Get the video file from S3
		const videoData = await s3Client.send(
			new GetObjectCommand({
				Bucket: srcBucket,
				Key: srcKey,
			}),
		);

		// Convert stream to buffer
		const chunks = [];
		for await (const chunk of videoData.Body) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);

		// Transcribe using Whisper
		const transcription = await openai.audio.transcriptions.create({
			file: new File([buffer], "video.mp4", { type: "video/mp4" }),
			model: "whisper-1",
			response_format: "verbose_json",
			timestamp_granularities: ["word"],
		});

		// Save transcription back to S3
		await s3Client.send(
			new PutObjectCommand({
				Bucket: srcBucket,
				Key: transcriptionKey,
				Body: JSON.stringify(transcription),
				ContentType: "application/json",
			}),
		);

		console.log(`Successfully transcribed ${srcKey}`);
		return {
			statusCode: 200,
			body: JSON.stringify({ message: "Transcription complete" }),
		};
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};
