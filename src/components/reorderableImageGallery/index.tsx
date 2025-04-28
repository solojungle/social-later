import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";

import Dropzone from "../dropzone";

interface Props {
  className?: string;
  images: {
    alt: string;
    id: string;
    src: string;
  }[];
}

export function ReorderableImageGallery({ className, ...props }: Props) {
  return (
    <div className={cn("flex space-x-2", className)} {...props}>
      {props.images.map((image) => (
        <div className="group relative" key={image.id}>
          <button
            className="absolute right-3 top-3 rounded-sm bg-background opacity-0 ring-offset-background transition-opacity duration-300 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            type="button"
          >
            <Cross2Icon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          <img
            alt={image.alt}
            className="h-32 w-32 rounded-md object-cover"
            key={image.id}
            src={image.src}
          />
        </div>
      ))}
      <Dropzone dropMessage="Drop files or click" handleOnDrop={handleDrop} />
      {props.images.length < 4 && (
        <>
          {new Array(3 - props.images.length).fill(null).map(() => (
            <div
              className="h-32 w-32 rounded-md border-2 bg-muted transition-colors duration-300"
              key={1}
            />
          ))}
        </>
      )}
    </div>
  );
}

function handleDrop() {
  console.log("handleDrop"); // Fixes build
}
