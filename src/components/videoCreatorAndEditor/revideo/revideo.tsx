"use client";

import { Player } from "@revideo/player-react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { getGithubRepositoryInfo } from "./actions";
import { parseStream } from "./parse";
import project from "./project";

function Button({
	children,
	loading,
	onClick,
}: {
	children: React.ReactNode;
	loading: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className="flex items-center gap-x-2 rounded-md bg-gray-200 p-2 text-sm text-gray-700 hover:bg-gray-300"
			onClick={() => onClick()}
			disabled={loading}
		>
			{loading && (
				<LoaderCircle className="h-4 w-4 animate-spin text-gray-700" />
			)}
			{children}
		</button>
	);
}

function RenderComponent({
	stargazerTimes,
	repoName,
	repoImage,
}: {
	stargazerTimes: number[];
	repoName: string;
	repoImage: string | null | undefined;
}) {
	const [renderLoading, setRenderLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	/**
	 * Render the video.
	 */
	async function render() {
		setRenderLoading(true);
		const res = await fetch("/api/render", {
			method: "POST",
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				variables: {
					data: stargazerTimes.length ? stargazerTimes : undefined,
					repoName: repoName || undefined,
					repoImage: repoImage || undefined,
				},
				streamProgress: true,
			}),
		}).catch((e) => console.log(e));

		if (!res) {
			alert("Failed to render video.");
			return;
		}

		const downloadUrl = await parseStream(res.body!.getReader(), (p) =>
			setProgress(p),
		);
		setRenderLoading(false);
		setDownloadUrl(downloadUrl);
	}

	return (
		<div className="flex gap-x-4">
			{/* Progress bar */}
			<div className="flex-1 overflow-hidden rounded-md bg-gray-100 text-sm">
				<div
					className="transition-200 flex h-full items-center bg-gray-400 px-4 text-gray-600 transition-all"
					style={{
						width: `${Math.round(progress * 100)}%`,
					}}
				>
					{Math.round(progress * 100)}%
				</div>
			</div>
			{downloadUrl ? (
				<a
					href={downloadUrl}
					download
					className="flex items-center gap-x-2 rounded-md bg-green-200 p-2 text-sm text-gray-700 hover:bg-gray-300"
				>
					Download video
				</a>
			) : (
				<Button onClick={() => render()} loading={renderLoading}>
					Render video
				</Button>
			)}
		</div>
	);
}

export default function Home() {
	const [repoName, setRepoName] = useState<string>("");
	const [repoImage, setRepoImage] = useState<string | null>();
	const [stargazerTimes, setStargazerTimes] = useState<number[]>([]);

	const [githubLoading, setGithubLoading] = useState(false);
	const [needsKey, setNeedsKey] = useState(false);
	const [key, setKey] = useState("");
	const [error, setError] = useState<string | null>();

	/**
	 * Get information about the repository from Github.
	 */
	async function fetchInformation(
		repoName: `${string}/${string}`,
		key: string,
	) {
		setGithubLoading(true);
		const response = await getGithubRepositoryInfo(repoName, key ?? undefined);
		setGithubLoading(false);

		if (response.status === "rate-limit") {
			setNeedsKey(true);
			return;
		}

		if (response.status === "error") {
			setError("Failed to fetch repository information from Github.");
			return;
		}

		setStargazerTimes(response.stargazerTimes);
		setRepoImage(response.repoImage);
	}

	return (
		<div className="m-auto flex max-w-7xl flex-col gap-y-4 p-12">
			<div>
				<div className="mb-2 text-sm text-gray-700">Repository</div>
				<div className="flex gap-x-4 text-sm">
					<input
						className="flex-1 rounded-md bg-gray-200 p-2 placeholder:text-gray-400 focus:outline-none"
						placeholder="redotvideo/revideo"
						value={repoName}
						onChange={(e) => setRepoName(e.target.value)}
					/>
					{!needsKey && (
						<Button
							loading={githubLoading}
							onClick={() =>
								fetchInformation(repoName as `${string}/${string}`, key)
							}
						>
							Fetch information
						</Button>
					)}
				</div>
			</div>
			{needsKey && (
				<div>
					<div className="mb-2 text-sm text-blue-600">
						You hit the Github API rate-limit. Please provide your own key.
						Requests to Github are made directly and the key stays on your
						device.
					</div>
					<div className="flex gap-x-4 text-sm">
						<input
							className="flex-1 rounded-md bg-gray-200 p-2 placeholder:text-gray-400 focus:outline-none"
							placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
							value={key}
							onChange={(e) => setKey(e.target.value)}
						/>
						<Button
							loading={githubLoading}
							onClick={() =>
								fetchInformation(repoName as `${string}/${string}`, key)
							}
						>
							Fetch information
						</Button>
					</div>
				</div>
			)}
			{error && <div className="text-sm text-red-600">{error}</div>}
			<div>
				<div className="overflow-hidden rounded-lg">
					{/* You can find the scene code inside revideo/src/scenes/example.tsx */}
					<Player
						project={project}
						controls={true}
						variables={{
							data: stargazerTimes.length > 0 ? stargazerTimes : undefined,
							repoName: repoName ? repoName : undefined,
							repoImage: repoImage ? repoImage : undefined,
						}}
					/>
				</div>
			</div>
			<RenderComponent
				stargazerTimes={stargazerTimes}
				repoName={repoName}
				repoImage={repoImage}
			/>
		</div>
	);
}
