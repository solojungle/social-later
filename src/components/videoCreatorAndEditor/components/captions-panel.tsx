"use client";

import { Clock, Edit2, Save, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InterfaceIcons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Caption, useEditorStore } from "@/stores/editor";
import { api } from "@/trpc/react";

interface CaptionItemProps {
  caption: Caption;
  formatTime: (ms: number) => string;
  isSelected: boolean;
  onCaptionEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onTimeEdit: (
    id: string,
    type: "durationMs" | "startMs",
    value: string,
  ) => void;
}

export function CaptionsPanel() {
  const {
    addCaption,
    captions,
    captionSettings,
    currentTime,
    deleteCaption,
    selectCaption,
    selectedCaptionId,
    setCaptions,
    updateCaption,
  } = useEditorStore();
  const { isLoading, mutateAsync: generateCaptions } =
    api.openai.transcribeVideo.useMutation({
      onSuccess: (result) => {
        if (!result) {
          return;
        }

        // Add ids to the captions
        const captionsWithIds = result.map(
          (caption: Caption, index: number) => ({
            ...caption,
            id: index.toString(),
          }),
        );

        setCaptions(captionsWithIds);
      },
    });

  const handleCaptionEdit = (id: string, newText: string) => {
    updateCaption(id, { text: newText });
  };

  const handleTimeEdit = (
    id: string,
    type: "durationMs" | "startMs",
    value: string,
  ) => {
    const timeInMs = parseInt(value, 10);
    if (!Number.isNaN(timeInMs)) {
      updateCaption(id, { [type]: timeInMs });
    }
  };

  const [fileId] = useQueryState("file");

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = ms % 1000;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <Card className="w-full rounded-none p-0 shadow-none">
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-left text-sm font-medium ">
            {captions.length} caption{captions.length !== 1 ? "s" : ""}
          </CardTitle>
          <div className="flex gap-2">
            <GenerateCaptionsButton
              captionSettings={captionSettings}
              fileId={fileId ?? ""}
              generateCaptions={generateCaptions}
              isLoading={isLoading}
            />
            <Button
              onClick={addCaption}
              size="sm"
              title={`Add caption at ${formatTime(currentTime)}`}
              variant="outline"
            >
              Add Caption at {formatTime(currentTime)}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {captions.length === 0 && (
            <p className="p-4 text-xs text-muted-foreground">
              Add captions by generating or by clicking the &quot;Add
              Caption&quot; button.
            </p>
          )}
          {captions.map((caption) => (
            <CaptionItem
              caption={caption}
              formatTime={formatTime}
              isSelected={selectedCaptionId === caption.id}
              key={caption.id}
              onCaptionEdit={handleCaptionEdit}
              onDelete={deleteCaption}
              onSelect={selectCaption}
              onTimeEdit={handleTimeEdit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CaptionItem({
  caption,
  formatTime,
  isSelected,
  onCaptionEdit,
  onDelete,
  onSelect,
  onTimeEdit,
}: CaptionItemProps) {
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null);

  const handleSaveCaption = () => {
    if (!editingCaption) return;
    onCaptionEdit(editingCaption.id, editingCaption.text);
    onTimeEdit(editingCaption.id, "startMs", editingCaption.startMs.toString());
    onTimeEdit(
      editingCaption.id,
      "durationMs",
      editingCaption.durationMs.toString(),
    );
    setEditingCaption(null);
  };

  return (
    <div
      className={`p-4 transition-colors hover:bg-muted ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={() => onSelect(caption.id)}
      role="presentation"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-1">
            <span className="font-mono text-xs text-muted-foreground">
              {formatTime(caption.startMs)} -{" "}
              {formatTime(caption.startMs + caption.durationMs)}
            </span>
          </div>
          <p className="line-clamp-3 text-sm">{caption.text}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingCaption(caption)}
                size="icon"
                variant="ghost"
              >
                <Edit2 className="size-4" />
                <span className="sr-only">Edit caption</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Caption</DialogTitle>
              </DialogHeader>
              {editingCaption && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Start Time</span>
                      </div>
                      <div className="relative">
                        <Input
                          className="font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setEditingCaption({
                              ...editingCaption,
                              startMs: value ? Number(value) : 0,
                            });
                          }}
                          placeholder="0"
                          value={editingCaption.startMs}
                        />
                        <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                          ms
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">End Time</span>
                      </div>
                      <div className="relative">
                        <Input
                          className="font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            const endTime = value ? Number(value) : 0;
                            setEditingCaption({
                              ...editingCaption,
                              durationMs: endTime - editingCaption.startMs,
                            });
                          }}
                          placeholder="0"
                          value={
                            editingCaption.startMs + editingCaption.durationMs
                          }
                        />
                        <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                          ms
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      className="text-sm font-medium"
                      htmlFor="caption-text"
                    >
                      Caption Text
                    </Label>
                    <Textarea
                      aria-labelledby="caption-text"
                      className="min-h-36"
                      id="caption-text"
                      name="caption-text"
                      onChange={(e) =>
                        setEditingCaption({
                          ...editingCaption,
                          text: e.target.value,
                        })
                      }
                      rows={3}
                      value={editingCaption.text}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      onClick={() => onDelete(editingCaption.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                    <div className="flex gap-2">
                      <DialogClose asChild>
                        <Button size="sm" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleSaveCaption} size="sm">
                          <Save className="mr-2 size-4" />
                          Save
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => onDelete(caption.id)}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete caption</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function GenerateCaptionsButton({
  captionSettings,
  fileId,
  generateCaptions,
  isLoading,
}: {
  captionSettings: {
    language: string;
    model: string;
  };
  fileId: string;
  generateCaptions: (data: {
    file: { id: string };
    language: string;
    model: string;
  }) => void;
  isLoading: boolean;
}) {
  return (
    <Button
      className="gap-2"
      disabled={isLoading}
      onClick={() => {
        if (!fileId) {
          return;
        }
        generateCaptions({
          file: { id: fileId },
          language: captionSettings.language,
          model: captionSettings.model,
        });
      }}
      size="sm"
      variant="outline"
    >
      {isLoading ? (
        <InterfaceIcons.Loading className="size-4 animate-spin" />
      ) : (
        <InterfaceIcons.ArtificialIntelligence className="size-4" />
      )}
      Generate
    </Button>
  );
}
