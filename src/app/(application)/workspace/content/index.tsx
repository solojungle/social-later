import { ResizablePanel } from "@/components/ui/resizable";

export const WorkspacePageContent = () => {
	return (
		<ResizablePanel
			id="calendar"
			order={2}
			defaultSize={80}
			className="h-full space-y-3 !overflow-scroll p-3"
		>
			<div className="flex space-x-6">
				<h1>Resources</h1>
				<a href="#">
					<article className="group relative col-span-1 grid h-[141px] w-full select-none items-end justify-start overflow-hidden rounded-lg bg-white shadow-card hover:bg-[#F8FCFE]">
						<div>
							<h2 className="text-sm font-semibold">How to Create an Arcade</h2>
							<p className="mt-0.5 text-xs text-gray-600">
								A four-step guide to getting started
							</p>
						</div>
					</article>
				</a>
			</div>
		</ResizablePanel>
	);
};
