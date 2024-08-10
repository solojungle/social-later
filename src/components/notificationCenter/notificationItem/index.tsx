import { formatDistanceToNow } from "date-fns";

import { InterfaceIcons } from "@/components/ui/icons";

import { Timeline } from "../timeline";

// This function given a type will return a message
function NotificationMessage({ type, from, files }: any) {
	switch (type) {
		case "join":
			return (
				<p className="text-xs">
					<span className="font-semibold">{from.name}</span> joined the team.
				</p>
			);
		case "upload":
			return (
				<p className="text-xs">
					<span className="font-semibold">{from.name}</span> uploaded{" "}
					{files.length} {files.length > 1 ? "files" : "file"}.
				</p>
			);
		default:
			return null;
	}
}

function NotificationIcon({ type }: any) {
	switch (type) {
		case "join":
			return <InterfaceIcons.Joined className="h-2.5 w-2.5 shrink-0" />;
		case "upload":
			return <InterfaceIcons.Attachments className="h-2.5 w-2.5 shrink-0" />;
		default:
			return null;
	}
}

function UploadAttachment({ from, type, createdAt, files }: any) {
	return (
		<div className="grid grid-cols-[40px_1fr] grid-rows-[40px_1fr] p-3">
			<div className="relative shrink-0">
				<img
					src={from.imageUrl}
					alt={from.name}
					className="h-10 w-10 rounded-full object-cover"
				/>
				<div className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
					{NotificationIcon({ type })}
				</div>
			</div>
			<div className="h-10 pl-3">
				<div className="flex flex-1 flex-col space-y-px">
					<div className="flex justify-between">
						<span>{NotificationMessage({ type, from, files })}</span>
					</div>
					<span className="text-xs font-light text-muted-foreground">
						{formatDistanceToNow(new Date(createdAt))} ago
					</span>
				</div>
			</div>

			<div className="flex w-10 items-center justify-center">
				<div className="h-full w-px bg-border" />
			</div>

			<div className="pl-3 pt-2">
				<Timeline files={files} />
			</div>
		</div>
	);
}

export function NotificationItem({
	id,
	setOpen,
	description,
	createdAt,
	recordId,
	from,
	to,
	markMessageAsRead,
	files,
	type,
}: any) {
	if (type === "upload") {
		return (
			<UploadAttachment
				from={from}
				type={type}
				createdAt={createdAt}
				files={files}
			/>
		);
	}

	return (
		<div className="flex items-center space-x-3 p-3 hover:bg-gray-100">
			<div className="relative shrink-0">
				<img
					src={from.imageUrl}
					alt={from.name}
					className="h-10 w-10 rounded-full object-cover"
				/>
				<div className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
					{NotificationIcon({ type })}
				</div>
			</div>
			<div className="flex flex-1 flex-col space-y-px">
				<div className="flex justify-between">
					<span>{NotificationMessage({ type, from })}</span>
				</div>
				<span className="text-xs font-light text-muted-foreground">
					{formatDistanceToNow(new Date(createdAt))} ago
				</span>
			</div>
		</div>
	);
}
