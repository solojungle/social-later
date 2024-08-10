import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { formatDistanceToNow } from "date-fns";

// This function given a type will return a message
function NotificationMessage({ type, from }: any) {

	// If the type is join, return the message
	// "from.name joined the team."
	// Otherwise, return null
	switch (type) {
		case "join":
			return <p className="text-xs"><span className="font-semibold">{from.name}</span> joined the team.</p>;
		default:
			return null;
	}






	return "";
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
	type,
}: any) {
	return (
		<div className="flex items-start space-x-3 p-3 hover:bg-gray-100">
			<div className="relative shrink-0">
				<img
					src={from.imageUrl}
					alt={from.name}
					className="h-10 w-10 rounded-full object-cover"
				/>
				<div className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500">
					<InterfaceIcons.Email className="h-2.5 w-2.5 shrink-0 text-white" />
				</div>
			</div>
			<div className="flex flex-1 flex-col space-y-1">
				<div className="flex justify-between">

						<span>{NotificationMessage({type, from})}</span>

				</div>
				<span className="text-xs font-light text-muted-foreground">
					{formatDistanceToNow(new Date(createdAt))} ago
				</span>
				{type === "request" && (
					<div className="mt-2 flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							className="border border-gray-300 text-sm"
						>
							Reject
						</Button>
						<Button size="sm" className="text-sm">
							Accept
						</Button>
					</div>
				)}
			</div>
		</div>
	);

}


// switch (type) {
// 	case "inbox":
// 		return (
// 			<div className="flex items-center justify-between space-x-4 p-3 hover:bg-secondary">
// 				<Link
// 					className="flex items-center justify-between space-x-4 "
// 					onClick={() => setOpen(false)}
// 					href={`/inbox?id=${recordId}`}
// 				>
// 					<div>
// 						<div className="flex h-9 w-9 items-center justify-center space-y-0 rounded-full border">
// 							<InterfaceIcons.Email className="h-4 w-4 shrink-0" />
// 						</div>
// 					</div>
// 					<div>
// 						<p className="text-sm">{description}</p>
// 						<span className="text-xs text-[#606060]">
// 							{formatDistanceToNow(new Date(createdAt))} ago
// 						</span>
// 					</div>
// 				</Link>
// 				{markMessageAsRead && (
// 					<div>
// 						<Button
// 							size="icon"
// 							variant="secondary"
// 							className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
// 							onClick={() => markMessageAsRead(id)}
// 						>
// 							<InterfaceIcons.Archive />
// 						</Button>
// 					</div>
// 				)}
// 			</div>
// 		);

// 	default:
// 		return null;
// }
