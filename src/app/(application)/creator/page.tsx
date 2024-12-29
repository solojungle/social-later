import { Button } from "@/components/ui/button";
import { VideoCreatorAndEditor } from "@/components/videoCreatorAndEditor";
import { Download, RefreshCw } from "lucide-react";

const sampleCaptions = [
	"Companies tend to",
	"overuse AI as a",
	"buzzword for selling",
	"their smartphones,",
	"smart TVs or even",
	"smart fridges.",
	"They do this in order",
	"to make people think",
	"that the technology in",
	"their product is more",
	"advanced than",
];

export default function CreatorPage() {
	return <VideoCreatorAndEditor />;
}
