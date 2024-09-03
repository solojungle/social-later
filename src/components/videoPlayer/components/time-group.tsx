import { Time } from "@vidstack/react";

export function TimeGroup() {
	return (
		<div className="ml-2.5 flex items-center text-sm font-medium">
			<Time type="current" />
			<div className="mx-1 text-white/80">/</div>
			<Time type="duration" />
		</div>
	);
}
