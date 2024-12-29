"use client";

import { useState } from "react";

export function VideoPreview() {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("video/")) {
			setVideoFile(file);
			setVideoUrl(URL.createObjectURL(file));
		}
	};

	return (
		<div className="sticky flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
			{!videoUrl ? (
				<>
					<h2 className="mb-4 text-xl font-semibold">
						Upload a video to get started
					</h2>
					<label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
						Choose Video
						<input
							type="file"
							accept="video/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</label>
				</>
			) : (
				<div className="w-full">
					<video
						src={videoUrl}
						controls
						className="w-full rounded-lg"
						style={{
							maxHeight: "400px",
							objectFit: "contain",
						}}
					>
						Your browser does not support the video tag.
					</video>
				</div>
			)}
		</div>
	);
}
