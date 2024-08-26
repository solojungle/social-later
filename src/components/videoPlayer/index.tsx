import "@vidstack/react/player/styles/base.css";

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";

export const VideoPlayer = () => {
	return (
		<MediaPlayer title="Sprite Fight" src="youtube/_cMxraX_5RE">
			<MediaProvider>
				<Poster
					className="absolute inset-0 block h-full w-full rounded-md bg-black opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
					src="https://files.vidstack.io/sprite-fight/poster.webp"
				/>
			</MediaProvider>
		</MediaPlayer>
	);
};
