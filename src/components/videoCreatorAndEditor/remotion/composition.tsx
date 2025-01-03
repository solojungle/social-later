import { AbsoluteFill, Video } from "remotion";

type VideoProps = {
	videoURL: string;
};

export const VideoComposition: React.FC<VideoProps> = ({
	videoURL,
}: VideoProps) => {
	return (
		<AbsoluteFill>
			<Video src={videoURL} />
		</AbsoluteFill>
	);
};
