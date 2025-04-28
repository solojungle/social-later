/* eslint-disable react/no-array-index-key */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import { InfoIcon, UploadCloudIcon } from "lucide-react";
import React from "react";
import { FileRejection, useDropzone } from "react-dropzone";

export type FileGalleryProps = {
  fileProgress: { [key: string]: { [key: number]: number } };
  files: FileUpload[] | null;
  isLoading: boolean;
  onRemoveFile: (index: string) => void;
  restrictions: {
    accept: Record<string, string[]>;
    maxFiles: number;
    maxSize: number;
    maxSizeInMB: string;
  };
};

export type FileUpload = {
  file: File;
  id: string;
  preview: (ArrayBuffer | string)[];
  progress: number;
};

export type MediaFormFieldProps = {
  fileProgress: { [key: string]: { [key: number]: number } };
  form: any;
  isLoading: boolean;
  restrictions: {
    accept: Record<string, string[]>;
    maxFiles: number;
    maxSize: number;
    maxSizeInMB: string;
  };
  valueName: string;
};

type HoverCardSectionProps = {
  restrictions: {
    accept: Record<string, string[]>;
    maxFiles: number;
    maxSize: number;
    maxSizeInMB: string;
  };
};

export function FileGallery({
  fileProgress,
  files,
  isLoading,
  onRemoveFile,
  restrictions,
}: FileGalleryProps) {
  if (files === null) {
    return (
      <div className="flex space-x-2">
        {new Array(restrictions.maxFiles).fill(null).map(() => (
          <div
            className="h-32 w-32 rounded-md border bg-muted"
            key={Math.random()}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid w-fit gap-2",
        returnNumberOfColumns(restrictions.maxFiles),
      )}
    >
      {files.map((file) => (
        <div className="group relative" key={file.id}>
          <button
            className="absolute right-3 top-3 z-20 rounded-sm border border-border bg-background opacity-0 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => onRemoveFile(file.id)}
            type="button"
          >
            <Cross2Icon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          <div className="absolute z-10 h-32 w-32 rounded-md bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          {file.preview.length === 0 ? (
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-md border border-border">
              <span className="flex w-32 justify-start overflow-hidden truncate px-1 text-sm">
                {file.file.name}
              </span>
              <span className="line-clamp-1 flex w-32 justify-center overflow-hidden text-ellipsis px-1 text-xs text-muted-foreground">
                {file.file.size} bytes
              </span>
            </div>
          ) : (
            <img
              alt="Uploaded file"
              className="h-32 w-32 rounded-md border border-border object-cover"
              key={file.id}
              src={file.preview as unknown as string}
            />
          )}

          {isLoading && (
            <Progress
              className="absolute bottom-0 w-full"
              value={Object.values(fileProgress[file.id] ?? {}).reduce(
                (acc, val) => acc + val,
                0,
              )}
            />
          )}
        </div>
      ))}
      {/* Show empty placeholders for the remaining files */}
      {/* {files.length < restrictions.maxFiles &&
				new Array(restrictions.maxFiles - files.length)
					.fill(null)
					.map(() => (
						<div
							key={Math.random()}
							className="h-32 w-32 rounded-md border bg-muted transition-colors duration-300"
						/>
					))} */}
    </div>
  );
}

export function MediaFormField({
  fileProgress,
  form,
  isLoading,
  restrictions,
  valueName,
}: MediaFormFieldProps) {
  const onDropAccepted = React.useCallback(
    (acceptedFiles: File[]) => {
      // Check if we have more than the max number of files
      if (form.getValues(valueName)?.length > restrictions.maxFiles - 1) {
        form.setError(valueName, {
          message: `You can only upload ${restrictions.maxFiles} images`,
          type: "manual",
        });
        return;
      }

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          // If the file is a video dont create a preview
          if (file.type.includes("video")) {
            const updatedFiles = [
              ...(form.getValues(valueName) || []),
              {
                file,
                id: Math.floor(Math.random() * 1000000).toString(),
                preview: [],
                progress: 0,
              },
            ];

            form.setValue(valueName, updatedFiles);
            return;
          }

          const updatedFiles = [
            ...(form.getValues(valueName) || []),
            {
              file,
              id: Math.floor(Math.random() * 1000000).toString(),
              preview: [reader.result as ArrayBuffer | string],
              progress: 0,
            },
          ];

          form.setValue(valueName, updatedFiles);
        };
        reader.readAsDataURL(file);
      });

      form.clearErrors(valueName);
    },
    [form, restrictions.maxFiles, valueName],
  );

  const onDropRejected = React.useCallback(
    (rejections: FileRejection[]) => {
      form.setError(valueName, {
        message: rejections.length > 0 ? rejections[0]?.errors[0]?.message : "",
        type: "manual",
      });
    },
    [form, valueName],
  );

  const handleRemoveFile = (id: string) => {
    const updatedFiles = (form.getValues(valueName) || []).filter(
      (file: FileUpload) => file.id !== id,
    );

    form.setValue(valueName, updatedFiles);
  };

  const { fileRejections, getInputProps, getRootProps, isDragActive } =
    useDropzone({
      accept: restrictions.accept,
      maxFiles: restrictions.maxFiles,
      maxSize: restrictions.maxSize,
      onDropAccepted,
      onDropRejected,
    });

  return (
    <FormField
      control={form.control}
      name={valueName}
      render={() => (
        <FormItem>
          <FormLabel
            className={`${fileRejections.length !== 0 && "text-destructive"}`}
          >
            <p className="capitalize">{valueName}</p>
            <span
              className={
                form.formState.errors.image || fileRejections.length !== 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            />
          </FormLabel>
          <FormControl>
            <div
              {...getRootProps()}
              className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-8 ${
                isDragActive ? "border-blue-600" : "border-primary"
              }`}
            >
              <HoverCardSection restrictions={restrictions} />
              <div
                className={`flex flex-col items-center justify-center ${
                  isDragActive ? "opacity-50" : ""
                }`}
              >
                <Input {...getInputProps()} type="file" />
                <div className="mb-3 flex items-center justify-center rounded-full border border-border bg-primary-foreground p-2">
                  <UploadCloudIcon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm text-primary">
                  Click to upload, or drag and drop
                </span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
          <FileGallery
            fileProgress={fileProgress}
            files={form.getValues(valueName) || []}
            isLoading={isLoading}
            onRemoveFile={handleRemoveFile}
            restrictions={restrictions}
          />
        </FormItem>
      )}
    />
  );
}

/**
 * grid-cols cannot be dynamic, so we need to return all possible values as a string
 * @param numberOfFiles - Number of files to display
 * @returns
 */
export function returnNumberOfColumns(numberOfFiles: number) {
  switch (numberOfFiles) {
    case 1:
      return "grid-cols-1";
    case 10:
      return "grid-cols-10";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    case 5:
      return "grid-cols-5";
    case 6:
      return "grid-cols-6";
    case 7:
      return "grid-cols-7";
    case 8:
      return "grid-cols-8";
    case 9:
      return "grid-cols-9";
    default:
      return "grid-cols-1";
  }
}

function HoverCardSection({ restrictions }: HoverCardSectionProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger className="absolute right-3 top-3 flex cursor-pointer items-center text-xs text-muted-foreground">
        Specifications
        <InfoIcon className="ml-1 h-4 w-4" />
      </HoverCardTrigger>
      <HoverCardContent className="text-xs" collisionPadding={{ right: 15 }}>
        <ul>
          <li>Max file size: {restrictions.maxSizeInMB}</li>
          <li>
            Supported formats:{" "}
            {Object.keys(restrictions.accept).map((key, index) => (
              <React.Fragment key={key}>
                {index > 0 && ", "}
                {restrictions.accept[key]?.join(", ") ?? ""}
              </React.Fragment>
            ))}
          </li>
          <li>Max number of files: {restrictions.maxFiles}</li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
