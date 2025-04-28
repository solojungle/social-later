import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useRef } from "react";

import { Input } from "../ui/input";

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  className?: string;
  classNameWrapper?: string;
  dropMessage: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

export function handleOnDrop(acceptedFiles: FileList | null) {
  console.log(acceptedFiles); // Fix build
  // if (acceptedFiles && acceptedFiles.length > 0) {
  // 	const allowedTypes = [
  // 		{ name: "csv", types: ["text/csv"] },
  // 		{
  // 			name: "excel",
  // 			types: [
  // 				"application/vnd.ms-excel",
  // 				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // 			],
  // 		},
  // 	];
  // 	const fileType = allowedTypes.find((allowedType) =>
  // 		allowedType.types.find((type) => type === acceptedFiles[0]?.type),
  // 	);
  // 	if (!fileType) {
  // 		form.setValue("file", null);
  // 		form.setError("file", {
  // 			message: "File type is not valid",
  // 			type: "typeError",
  // 		});
  // 	} else {
  // 		form.setValue("file", acceptedFiles[0]);
  // 		form.clearErrors("file");
  // 	}
  // } else {
  // 	form.setValue("file", null);
  // 	form.setError("file", {
  // 		message: "File is required",
  // 		type: "typeError",
  // 	});
  // }
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, classNameWrapper, dropMessage, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    // Function to handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleOnDrop(null);
    };

    // Function to handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        handleOnDrop(files);
      }
    };

    // Function to simulate a click on the file input element
    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
    return (
      <Card
        className={cn(
          `h-32 w-32 border-2 border-dashed bg-muted transition-colors duration-300 hover:cursor-pointer hover:border-muted-foreground/50`,
          classNameWrapper,
        )}
        ref={ref}
      >
        <CardContent
          className="flex h-full flex-col items-center justify-center p-0 text-xs text-muted-foreground"
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* <PlusIcon className="h-6 w-6" /> */}
          <span className="flex flex-col items-center justify-center font-medium">
            {dropMessage}
          </span>
          <Input
            {...props}
            className={cn("hidden", className)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleOnDrop(e.target.files)
            }
            ref={inputRef}
            type="file"
            value={undefined}
          />
        </CardContent>
      </Card>
    );
  },
);

Dropzone.displayName = "Dropzone";

export default Dropzone;
