"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2, SparklesIcon, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { useEditor } from "../context/editor-context";

export function CaptionsPanel() {
  const {
    addCaption,
    captions,
    deleteCaption,
    selectCaption,
    selectedCaptionId,
    setCaptions,
    updateCaption,
  } = useEditor();
  const [editingId, setEditingId] = useState<null | string>(null);
  const { captionSettings } = useEditor();
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

  const [fileId] = useQueryState("file");

  return (
    <div className="flex-1">
      <div className="space-y-4">
        <div className="flex">
          <h3 className="font-medium">Captions</h3>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            disabled={!fileId || isLoading}
            onClick={() =>
              generateCaptions({
                file: {
                  id: fileId ?? "",
                },
                language: captionSettings.language,
                model: captionSettings.model,
              })
            }
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            Generate Captions
          </Button>
          <Button onClick={addCaption} size="sm" variant="outline">
            Add Caption
          </Button>
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
              <div className="flex flex-1 items-center">
                <span className="min-w-24 text-xs text-muted-foreground">
                  {caption.startMs} - {caption.endMs}
                </span>
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
              <button
                aria-label="Delete caption"
                className="invisible ml-2 text-muted-foreground hover:text-destructive group-hover:visible"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCaption(caption.id);
                }}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
