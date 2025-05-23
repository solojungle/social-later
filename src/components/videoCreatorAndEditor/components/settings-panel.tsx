/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Caption, useEditorStore } from "@/stores/editor";
import { api } from "@/trpc/react";

import { LanguageSelector } from "./language-selector";

export function SettingsPanel() {
  const { captionSettings, setCaptions, updateCaptionSettings } =
    useEditorStore();
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [fileId] = useQueryState("file");
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

  return (
    <div className="w-full md:w-[400px]">
      <h2 className="font-medium">Advanced Settings</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Customize subtitle generation parameters
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Generate captions</label>
          <GenerateCaptionsButton
            captionSettings={captionSettings}
            fileId={fileId ?? ""}
            generateCaptions={generateCaptions}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Select
            defaultValue={captionSettings.model}
            onValueChange={(value) => updateCaptionSettings({ model: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whisper-1">whisper-1</SelectItem>
              <SelectItem value="gpt-4o-mini-transcribe">
                gpt-4o-mini-transcribe
              </SelectItem>
              <SelectItem value="gpt-4o-transcribe">
                gpt-4o-transcribe
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* What the original language of the video is */}
        <div className="flex flex-col items-start justify-between space-y-2 rounded-sm border border-border p-4">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Original Language</label>
            <p className="text-xs text-muted-foreground">
              What the original language of the video is
            </p>
          </div>
          <LanguageSelector />
        </div>

        <div className="flex items-center justify-between rounded-sm border border-border p-4">
          <label className="text-sm font-medium">Remove Punctuation</label>
          <Switch
            checked={removePunctuation}
            onCheckedChange={setRemovePunctuation}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Max words</label>
            <Input defaultValue={6} type="number" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max characters</label>
            <Input defaultValue={25} type="number" />
          </div>
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
      className="w-full gap-2"
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
      Generate captions
    </Button>
  );
}
