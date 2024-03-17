import { Input } from "@/components/ui/input";
import { ResizablePanel } from "@/components/ui/resizable";

export default function HelpCenterPage() {
	return (
		<ResizablePanel
			id="help"
			order={2}
			defaultSize={80}
			className="h-full space-y-2 !overflow-scroll p-3 pb-48"
		>
			<h1>Advice and answers from the FeedFrenzy Team</h1>
			<Input placeholder="Search for articles..." />
		</ResizablePanel>
	);
}
