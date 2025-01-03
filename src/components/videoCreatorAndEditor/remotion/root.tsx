import React from "react";
import { Composition } from "remotion";

import { VideoComposition } from "./composition";

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Empty"
			component={VideoComposition}
			durationInFrames={60}
			fps={30}
			width={1280}
			height={720}
		/>
	);
};
