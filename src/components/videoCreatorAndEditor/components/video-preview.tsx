import { RemotionPlayer } from "../2ndtry";

interface VideoPreviewProps {
  src: string;
}

export async function VideoPreview({ src }: VideoPreviewProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="relative" style={{ height: "100%", width: "100%" }}>
      <RemotionPlayer src={src} />
    </div>
  );
}
