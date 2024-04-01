// // dependencies
// import {
// 	GetObjectCommand,
// 	PutObjectCommand,
// 	S3Client,
// } from "@aws-sdk/client-s3";
// import sharp from "sharp";
// import util from "util";

// // get reference to S3 client
// const client = new S3Client({});

// async function getObject(Bucket, Key) {
// 	const stream = await client
// 		.send(
// 			new GetObjectCommand({
// 				Bucket,
// 				Key,
// 			}),
// 		)
// 		.then((response) => response.Body);

// 	return new Promise((resolve, reject) => {
// 		const chunks = [];
// 		stream.on("data", (chunk) => chunks.push(chunk));
// 		stream.once("end", () => resolve(Buffer.concat(chunks)));
// 		stream.once("error", reject);
// 	});
// }

// export const handler = async (event, context) => {
// 	// Read options from the event parameter.
// 	console.log(
// 		"Reading options from event:\n",
// 		util.inspect(event, { depth: 5 }),
// 	);
// 	const srcBucket = event.Records[0].s3.bucket.name;
// 	// Object key may have spaces or unicode non-ASCII characters.
// 	const srcKey = decodeURIComponent(
// 		event.Records[0].s3.object.key.replace(/\+/g, " "),
// 	);
// 	const dstBucket = `${srcBucket}-thumbnails`;
// 	const dstKey = `thumbnails-${srcKey}`;

// 	// Infer the image type from the file suffix.
// 	const typeMatch = srcKey.match(/\.([^.]*)$/);
// 	if (!typeMatch) {
// 		console.log("Could not determine the image type.");
// 		return;
// 	}

// 	const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "plain", "webp"];

// 	// Check that the image type is supported
// 	const imageType = typeMatch[1].toLowerCase();
// 	if (!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
// 		console.log(`Unsupported image type: ${imageType}`);
// 		return;
// 	}

// 	// Download the image from the S3 source bucket.
// 	try {
// 		// Get the stream and convert into a buffer
// 		const originalImage = await getObject(srcBucket, srcKey);

// 		// Use the sharp module to resize the image and save in a buffer.
// 		const buffer = await sharp(originalImage).resize({ width: 200 }).toBuffer();

// 		// Upload the thumbnail image to the destination bucket
// 		const putObjectParams = new PutObjectCommand({
// 			Bucket: dstBucket,
// 			Key: dstKey,
// 			Body: buffer,
// 		});

// 		await client.send(putObjectParams);
// 	} catch (error) {
// 		console.log(error);
// 		return;
// 	}

// 	console.log(
// 		`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`,
// 	);
// };
