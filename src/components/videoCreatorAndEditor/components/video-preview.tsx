"use client";

import { Download, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { useEditor } from "../context/editor-context";

interface DragState {
	captionId: string;
	offset: { x: number; y: number };
}

export function VideoPreview() {
	const {
		videoUrl,
		setVideoFile,
		setVideoUrl,
		captions,
		selectedCaptionId,
		updateCaption,
	} = useEditor();
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dragState, setDragState] = useState<DragState | null>(null);
	const [maxHeight, setMaxHeight] = useState("100vh");
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		const updateMaxHeight = () => {
			setMaxHeight(`${window.innerHeight - 48}px`);
		};

		updateMaxHeight();
		window.addEventListener("resize", updateMaxHeight);
		return () => window.removeEventListener("resize", updateMaxHeight);
	}, []);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("video/")) {
			setVideoFile(file);
			setVideoUrl(URL.createObjectURL(file));
		}
	};

	const handleRemoveVideo = () => {
		setVideoFile(null);
		setVideoUrl(null);
	};

	const handleExport = async () => {
		if (!videoRef.current || !containerRef.current) return;
		setExporting(true);

		try {
			// Here you would implement the actual video export logic
			// This is a placeholder that just downloads the original video
			const response = await fetch(videoUrl!);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "video-with-captions.mp4";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export video:", error);
		} finally {
			setExporting(false);
		}
	};

	const handlePointerDown = (event: React.PointerEvent, captionId: string) => {
		if (!containerRef.current) return;

		const container = containerRef.current.getBoundingClientRect();
		const x = ((event.clientX - container.left) / container.width) * 100;
		const y = ((event.clientY - container.top) / container.height) * 100;

		const caption = captions.find((c) => c.id === captionId);
		if (!caption) return;

		setDragState({
			captionId,
			offset: {
				x: x - caption.style.position.x,
				y: y - caption.style.position.y,
			},
		});

		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: React.PointerEvent) => {
		if (!dragState || !containerRef.current) return;

		const container = containerRef.current.getBoundingClientRect();
		const x = ((event.clientX - container.left) / container.width) * 100;
		const y = ((event.clientY - container.top) / container.height) * 100;
		updateCaption(dragState.captionId, {
			style: {
				position: {
					x: Math.max(0, Math.min(100, x - dragState.offset.x)),
					y: Math.max(0, Math.min(100, y - dragState.offset.y)),
				},
			},
		});
	};

	const handlePointerUp = () => {
		setDragState(null);
	};

	return (
		<div className="space-y-2 py-2">
			{videoUrl && (
				<div className="flex justify-start">
					<Button
						onClick={handleExport}
						disabled={exporting}
						className="flex items-center gap-2"
					>
						<Download className="h-4 w-4" />
						{exporting ? "Exporting..." : "Export Video"}
					</Button>
				</div>
			)}
			<div
				className="relative mx-auto w-full overflow-hidden rounded-lg bg-black"
				style={{
					aspectRatio: "9/16",
					maxHeight,
				}}
			>
				{videoUrl ? (
					<>
						<div ref={containerRef} className="relative h-full w-full">
							<video
								ref={videoRef}
								src={videoUrl}
								className="h-full w-full object-contain"
								controls
								loop
							/>
							{captions.map((caption) => (
								<div
									key={caption.id}
									className={`absolute select-none transition-all ${
										selectedCaptionId === caption.id
											? "ring-2 ring-primary"
											: ""
									}`}
									style={{
										left: `${caption.style.position.x}%`,
										top: `${caption.style.position.y}%`,
										fontSize: `${caption.style.fontSize}px`,
										fontFamily: caption.style.fontFamily,
										color: caption.style.color,
										textTransform: caption.style.textTransform,
										textShadow:
											caption.style.shadow === "none"
												? "none"
												: caption.style.shadow === "small"
												? "1px 1px 2px rgba(0,0,0,0.5)"
												: caption.style.shadow === "medium"
												? "2px 2px 4px rgba(0,0,0,0.5)"
												: "3px 3px 6px rgba(0,0,0,0.5)",
										transform: "translate(-50%, -50%)",
										cursor:
											dragState?.captionId === caption.id ? "grabbing" : "grab",
										touchAction: "none",
									}}
									onPointerDown={(e) => handlePointerDown(e, caption.id)}
									onPointerMove={handlePointerMove}
									onPointerUp={handlePointerUp}
								>
									{caption.text}
								</div>
							))}
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 top-2 z-10 bg-black/50 hover:bg-black/70"
							onClick={handleRemoveVideo}
						>
							<X className="h-4 w-4" />
						</Button>
					</>
				) : (
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<input
							type="file"
							accept="video/*"
							onChange={handleFileChange}
							className="hidden"
							id="video-upload"
						/>
						<label
							htmlFor="video-upload"
							className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
						>
							<Upload className="h-4 w-4" />
							Upload Video
						</label>
						<p className="mt-2 text-sm text-muted-foreground">
							Supports MP4, WebM videos
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
