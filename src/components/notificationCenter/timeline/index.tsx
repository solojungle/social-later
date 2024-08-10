function ImageUploads() {
	return (
		<div>
			<h2>Image Uploads</h2>
			<p>
				We are excited to announce the launch of the Timeline feature. Now you
				can keep track of all your notifications in one place.
			</p>
		</div>
	);
}

function TimelineItem({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative">
			<div className="absolute left-[-2.20rem] top-5 h-1.5 w-1.5 rounded-full bg-primary" />
			<div className="rounded-sm border border-border bg-muted p-4 text-xs">
				{children}
			</div>
		</div>
	);
}

export function Timeline() {
	return (
		<div className="relative flex">
			<div className="space-y-1">
				<TimelineItem>
					<p>
						We are excited to announce the launch of the Timeline feature. Now
						you can keep track of all your notifications in one place.
					</p>
				</TimelineItem>
				<TimelineItem>
					<p>
						We are excited to announce the launch of the Timeline feature. Now
						you can keep track of all your notifications in one place.
					</p>
				</TimelineItem>
			</div>
		</div>
	);
}
