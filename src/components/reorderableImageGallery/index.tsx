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
				<div key={image.id} className="relative">
					<button
						className="absolute right-2 top-2 rounded-full bg-gray-800 p-1 text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
						type="button"
						onClick={() => {
							// Handle removal of the image
							// For example, you can use a function passed as a prop from the parent component
						}}
					/>
					<img
						key={image.id}
						src={image.src}
						alt={image.alt}
						className="h-32 w-32 rounded-md object-cover"
					/>
				</div>
			))}
			<Dropzone
				className="h-32 w-32 rounded-md"
				dropMessage=""
				handleOnDrop={function (acceptedFiles: FileList | null): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</div>
	);
}
