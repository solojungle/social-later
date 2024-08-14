import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InterfaceIcons } from "@/components/ui/icons";

import { Timeline } from "../timeline";

// This function given a type will return a message
function NotificationMessage({ type, from, message, files = [] }: any) {
	const fileCount = files.length;
	const fileLabel = fileCount > 1 || fileCount === 0 ? "files" : "file";

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
					<span className="font-semibold">{from.name}</span>
					{` uploaded ${fileCount} ${fileLabel}.`}
				</p>
			);
		default:
			return (
				<p className="text-xs">
					<span className="font-semibold">{from.name}</span> {message}
				</p>
			);
	}
}

function NotificationIcon({ type }: any) {
	switch (type) {
		case "join":
			return <InterfaceIcons.Joined className="h-2.5 w-2.5 shrink-0" />;
		case "upload":
			return <InterfaceIcons.Attachments className="h-2.5 w-2.5 shrink-0" />;
		default:
			return <InterfaceIcons.Email className="h-2.5 w-2.5 shrink-0" />;
	}
}

function NotificationAvatar({
	from,
	type,
}: {
	from: { name: string; image: string };
	type: string;
}) {
	return (
		<div className="relative shrink-0">
			<Avatar className="flex h-10 w-10 items-center justify-center bg-background">
				<AvatarFallback className="flex items-center justify-center border border-border text-xs">
					{from.name.split(" ").map((name: string) => name[0])}
				</AvatarFallback>
			</Avatar>
			<div className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
				<NotificationIcon type={type} />
			</div>
		</div>
	);
}

function UploadAttachment({ from, type, createdAt, files }: any) {
	return (
		<div className="grid grid-cols-[40px_1fr] grid-rows-[40px_1fr] p-3">
			<NotificationAvatar from={from} type={type} />
			<div className="h-10 pl-3">
				<div className="flex flex-1 flex-col space-y-px">
					<div className="flex justify-between">
						<span>
							<NotificationMessage type={type} from={from} files={files} />
						</span>
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
	message,
	createdAt,
	from,
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
			<NotificationAvatar from={from} type={type} />
			<div className="flex flex-1 flex-col space-y-px">
				<div className="flex justify-between">
					<span>
						<NotificationMessage
							type={type}
							from={from}
							files={files}
							message={message}
						/>
					</span>
				</div>
				<span className="text-xs font-light text-muted-foreground">
					{formatDistanceToNow(new Date(createdAt))} ago
				</span>
			</div>
		</div>
	);
}
