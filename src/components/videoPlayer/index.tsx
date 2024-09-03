import "@vidstack/react/player/styles/base.css";

import {
	isHLSProvider,
	MediaPlayer,
	type MediaPlayerInstance,
	MediaProvider,
	type MediaProviderAdapter,
	Poster,
} from "@vidstack/react";
import { useEffect, useRef } from "react";

import { VideoLayout } from "./components/layouts/video-layout";

type PlayerProps = {
	title: string;
	video: string;
	poster: string;
	posterAlt: string;
	thumbnails: string;
};

export function Player({
	title,
	video,
	poster,
	posterAlt,
	thumbnails,
}: PlayerProps) {
	const player = useRef<MediaPlayerInstance>(null);

	useEffect(() => {
		// Subscribe to state updates.
		return player.current!.subscribe(() => {
			// console.log('is paused?', '->', state.paused);
			// console.log('is audio view?', '->', state.viewType === 'audio');
		});
	}, []);

	function onProviderChange(
		provider: MediaProviderAdapter | null,
		// nativeEvent: MediaProviderChangeEvent,
	) {
		// We can configure provider's here.
		if (isHLSProvider(provider)) {
			// eslint-disable-next-line no-param-reassign
			provider.config = {};
		}
	}

	// We can listen for the `can-play` event to be notified when the player is ready.
	function onCanPlay() {
		// detail: MediaCanPlayDetail,
		// nativeEvent: MediaCanPlayEvent,
		// ...
	}

	return (
		<MediaPlayer
			className="aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white data-[focus]:ring-4"
			title={title}
			src={video}
			crossOrigin
			playsInline
			// eslint-disable-next-line react/jsx-no-bind
			onProviderChange={onProviderChange}
			// eslint-disable-next-line react/jsx-no-bind
			onCanPlay={onCanPlay}
			ref={player}
		>
			<MediaProvider>
				<Poster
					className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
					src={poster}
					alt={posterAlt}
				/>
			</MediaProvider>
			<VideoLayout thumbnails={thumbnails} />
		</MediaPlayer>
	);
}
