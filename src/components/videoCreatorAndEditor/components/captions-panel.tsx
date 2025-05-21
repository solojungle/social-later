"use client";

import { Loader2, SparklesIcon, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/stores/editor";
import { api } from "@/trpc/react";

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
  const [editingId, setEditingId] = useState<null | string>(null);
  const [editingTimeId, setEditingTimeId] = useState<null | string>(null);
  const { isLoading, mutateAsync: generateCaptions } =
    api.openai.transcribeVideo.useMutation({
      onSuccess: (result) => {
        if (!result) {
          return;
        }

        // Add ids to the captions
        const captionsWithIds = result.map((caption, index) => ({
          ...caption,
          id: index.toString(),
        }));

        setCaptions(captionsWithIds);
      },
    });

  const handleCaptionEdit = (id: string, newText: string) => {
    updateCaption(id, { text: newText });
  };

  const handleTimeEdit = (
    id: string,
    type: "endMs" | "startMs",
    value: string,
  ) => {
    const timeInMs = parseFloat(value) * 1000;
    if (!Number.isNaN(timeInMs)) {
      updateCaption(id, { [type]: timeInMs });
    }
  };

  const [fileId] = useQueryState("file");

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTimeForInput = (ms: number) => {
    return (ms / 1000).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Captions</h2>
        <div className="flex gap-2">
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
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SparklesIcon className="size-4" />
            )}
            Generate
          </Button>
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

      <div className="space-y-2 rounded-lg border p-4">
        <span className="self-end text-sm text-muted-foreground">
          {captions.length} captions
        </span>
        {captions.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add captions by generating or by clicking the &quot;Add
            Caption&quot; button.
          </p>
        )}
        {captions.map((caption) => (
          <div
            className={`group flex items-center rounded-md p-2 text-sm hover:bg-muted ${
              selectedCaptionId === caption.id ? "bg-muted" : ""
            }`}
            key={caption.id}
            onClick={() => selectCaption(caption.id)}
            role="presentation"
          >
            <div className="flex flex-1 items-center gap-2">
              {editingTimeId === caption.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    className="w-20"
                    defaultValue={formatTimeForInput(caption.startMs)}
                    onBlur={(e) => {
                      handleTimeEdit(caption.id, "startMs", e.target.value);
                      setEditingTimeId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    step="0.1"
                    type="number"
                  />
                  <span>-</span>
                  <Input
                    className="w-20"
                    defaultValue={formatTimeForInput(caption.endMs)}
                    onBlur={(e) => {
                      handleTimeEdit(caption.id, "endMs", e.target.value);
                      setEditingTimeId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    step="0.1"
                    type="number"
                  />
                </div>
              ) : (
                <button
                  className="min-w-24 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTimeId(caption.id);
                  }}
                  type="button"
                >
                  {formatTime(caption.startMs)} - {formatTime(caption.endMs)}
                </button>
              )}
              {editingId === caption.id ? (
                <input
                  className="flex-1 bg-transparent outline-none"
                  onBlur={() => setEditingId(null)}
                  onChange={(e) =>
                    handleCaptionEdit(caption.id, e.target.value)
                  }
                  type="text"
                  value={caption.text}
                />
              ) : (
                <span
                  className="max-w-[200px] cursor-pointer"
                  onClick={() => setEditingId(caption.id)}
                  role="presentation"
                >
                  {caption.text}
                </span>
              )}
            </div>
            <Button
              className="opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                deleteCaption(caption.id);
              }}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
