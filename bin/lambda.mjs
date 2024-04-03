// dependencies
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import util from "util";

// ffmpeg
const commander = util.promisify(exec);

// get reference to S3 client
const client = new S3Client({});

async function getObject(Bucket, Key, Range) {
	const stream = await client
		.send(
			new GetObjectCommand({
				Bucket,
				Key,
				Range,
			}),
		)
		.then((response) => response.Body);

	return new Promise((resolve, reject) => {
		const chunks = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.once("end", () => resolve(Buffer.concat(chunks)));
		stream.once("error", reject);
	});
}

export const handler = async (event, context) => {
	// Read options from the event parameter.
	console.log(
		"Reading options from event:\n",
		util.inspect(event, { depth: 5 }),
	);
	const srcBucket = event.Records[0].s3.bucket.name;
	// Object key may have spaces or unicode non-ASCII characters.
	const srcKey = decodeURIComponent(
		event.Records[0].s3.object.key.replace(/\+/g, " "),
	);
	const dstBucket = `${srcBucket}-thumbnails`;
	const dstKey = srcKey;

	// Infer the image type from the file suffix.
	const typeMatch = srcKey.match(/\.([^.]*)$/);
	if (!typeMatch) {
		console.log("Could not determine the image type.");
		return;
	}

	const ACCEPTED_FILE_TYPES = [
		"jpeg",
		"jpg",
		"mp4",
		"mov",
		"gif",
		"png",
		"webp",
	];

	// Check that the image type is supported
	const imageType = typeMatch[1]?.toLowerCase() || "";
	if (!ACCEPTED_FILE_TYPES.includes(imageType)) {
		console.log(`Unsupported file type: ${imageType}`);
		return;
	}

	// If the file is a video we want to do different things
	if (imageType === "mp4" || imageType === "mov") {
		// Partially extract the video
		const video = await getSignedUrl(
			client,
			new GetObjectCommand({
				Bucket: srcBucket,
				Key: srcKey,
			}),
			{ expiresIn: 3600 },
		);

		const workdir = os.tmpdir();
		const filename = srcKey.replace(/\.[^/.]+$/, ".jpg");
		const outputFile = path.join(workdir, filename);

		await commander(
			`/opt/ffmpeg/ffmpeg -i "${video}" -vf scale=200:-2 -vframes 1 ${outputFile}`,
		);

		// Upload the thumbnail image to the destination bucket
		const putObjectParams = new PutObjectCommand({
			Bucket: dstBucket,
			Key: filename,
			Body: fs.createReadStream(outputFile),
		});

		await client.send(putObjectParams);

		console.log(
			`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${filename}`,
		);

		return;
	}

	// Download the image from the S3 source bucket.
	try {
		// Get the stream and convert into a buffer
		const originalImage = await getObject(srcBucket, srcKey);

		// Use the sharp module to resize the image and save in a buffer.
		const buffer = await sharp(originalImage).resize({ width: 200 }).toBuffer();

		// Upload the thumbnail image to the destination bucket
		const putObjectParams = new PutObjectCommand({
			Bucket: dstBucket,
			Key: dstKey,
			Body: buffer,
		});

		await client.send(putObjectParams);
	} catch (error) {
		console.log(error);
		return;
	}

	console.log(
		`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`,
	);
};
