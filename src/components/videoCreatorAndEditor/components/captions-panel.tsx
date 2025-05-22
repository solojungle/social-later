"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Caption, useEditorStore } from "@/stores/editor";
import { api } from "@/trpc/react";

interface CaptionItemProps {
  caption: Caption;
  formatTime: (ms: number) => string;
  formatTimeForInput: (ms: number) => string;
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

interface CaptionListProps {
  captions: Caption[];
  formatTime: (ms: number) => string;
  formatTimeForInput: (ms: number) => string;
  onCaptionEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onTimeEdit: (
    id: string,
    type: "durationMs" | "startMs",
    value: string,
  ) => void;
  selectedCaptionId: null | string;
}

interface TimeEditInputsProps {
  caption: Caption;
  formatTimeForInput: (ms: number) => string;
  onBlur: () => void;
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

      <CaptionList
        captions={captions}
        formatTime={formatTime}
        formatTimeForInput={formatTimeForInput}
        onCaptionEdit={handleCaptionEdit}
        onDelete={deleteCaption}
        onSelect={selectCaption}
        onTimeEdit={handleTimeEdit}
        selectedCaptionId={selectedCaptionId}
      />
    </div>
  );
}

function CaptionItem({
  caption,
  formatTime,
  formatTimeForInput,
  isSelected,
  onCaptionEdit,
  onDelete,
  onSelect,
  onTimeEdit,
}: CaptionItemProps) {
  const [editingId, setEditingId] = useState<null | string>(null);
  const [editingTimeId, setEditingTimeId] = useState<null | string>(null);

  return (
    <div
      className={`group flex items-center rounded-md p-2 text-sm hover:bg-muted ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={() => onSelect(caption.id)}
      role="presentation"
    >
      <div className="flex flex-1 items-center gap-2">
        {editingTimeId === caption.id && (
          <TimeEditInputs
            caption={caption}
            formatTimeForInput={formatTimeForInput}
            onBlur={() => setEditingTimeId(null)}
            onTimeEdit={onTimeEdit}
          />
        )}
        {editingTimeId !== caption.id && (
          <button
            className="min-w-24 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTimeId(caption.id);
            }}
            type="button"
          >
            {formatTime(caption.startMs)} -{" "}
            {formatTime(caption.startMs + caption.durationMs)}
          </button>
        )}
        {editingId === caption.id && (
          <input
            className="flex-1 bg-transparent outline-none"
            onBlur={() => setEditingId(null)}
            onChange={(e) => onCaptionEdit(caption.id, e.target.value)}
            type="text"
            value={caption.text}
          />
        )}
        {editingId !== caption.id && (
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
          onDelete(caption.id);
        }}
        size="icon"
        variant="ghost"
      >
        <InterfaceIcons.Destructive className="size-4" />
      </Button>
    </div>
  );
}

function CaptionList({
  captions,
  formatTime,
  formatTimeForInput,
  onCaptionEdit,
  onDelete,
  onSelect,
  onTimeEdit,
  selectedCaptionId,
}: CaptionListProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <span className="self-end text-sm text-muted-foreground">
        {captions.length} captions
      </span>
      {captions.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add captions by generating or by clicking the &quot;Add Caption&quot;
          button.
        </p>
      )}
      {captions.map((caption) => (
        <CaptionItem
          caption={caption}
          formatTime={formatTime}
          formatTimeForInput={formatTimeForInput}
          isSelected={selectedCaptionId === caption.id}
          key={caption.id}
          onCaptionEdit={onCaptionEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          onTimeEdit={onTimeEdit}
        />
      ))}
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

function TimeEditInputs({
  caption,
  formatTimeForInput,
  onBlur,
  onTimeEdit,
}: TimeEditInputsProps) {
  return (
    <div className="flex items-center gap-1">
      <Input
        className="w-20"
        defaultValue={formatTimeForInput(caption.startMs)}
        onBlur={(e) => {
          onTimeEdit(caption.id, "startMs", e.target.value);
          onBlur();
        }}
        onClick={(e) => e.stopPropagation()}
        step="0.1"
        type="number"
      />
      <span>-</span>
      <Input
        className="w-20"
        defaultValue={formatTimeForInput(caption.durationMs)}
        onBlur={(e) => {
          onTimeEdit(caption.id, "durationMs", e.target.value);
          onBlur();
        }}
        onClick={(e) => e.stopPropagation()}
        step="0.1"
        type="number"
      />
    </div>
  );
}
