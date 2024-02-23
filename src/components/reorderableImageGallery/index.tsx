import { Cross2Icon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import Dropzone from "../dropzone";

interface Props {
	images: {
		id: string;
		src: string;
		alt: string;
	}[];
	className?: string;
}

export function ReorderableImageGallery({ className, ...props }: Props) {
	return (
		<div className={cn("flex space-x-2", className)} {...props}>
			{props.images.map((image) => (
				<div key={image.id} className="group relative">
					<button
						type="button"
						className="absolute right-3 top-3 rounded-sm bg-background opacity-0 ring-offset-background transition-opacity duration-300 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
					>
						<Cross2Icon className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</button>
					<img
						key={image.id}
						src={image.src}
						alt={image.alt}
						className="h-32 w-32 rounded-md object-cover"
					/>
				</div>
			))}
			<Dropzone
				dropMessage="Drop files or click"
				handleOnDrop={function (acceptedFiles: FileList | null): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</div>
	);
}
