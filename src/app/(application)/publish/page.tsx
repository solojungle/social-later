"use client";

import { PostsCalendar } from "@/components/calendar";
import { PlannedPosts } from "@/components/plannedPosts";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

export default function PublishPage() {
	return (
		<>
			<ResizablePanel minSize={28}>
				<PlannedPosts />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel minSize={30} className="p-5">
				<PostsCalendar posts={[]} />
			</ResizablePanel>
		</>
	);
}
