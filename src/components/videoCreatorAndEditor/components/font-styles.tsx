/* eslint-disable jsx-a11y/label-has-associated-control */

"use client";

import { Compact } from "@uiw/react-color";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor";

import { FontTemplates } from "./font-templates";

export function FontStyles() {
  const { updateGlobalStyles } = useEditorStore();
  const [textFormat, setTextFormat] = useState<
    "lowercase" | "none" | "uppercase"
  >("none");
  const [textShadow, setTextShadow] = useState<
    "large" | "medium" | "none" | "small"
  >("none");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontColor, setFontColor] = useState<string>("#FFFFFF");

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0] ?? 24;
    setFontSize(newSize);
    updateGlobalStyles({ fontSize: newSize });
  };

  const handleColorChange = (color: string) => {
    setFontColor(color);
    updateGlobalStyles({ color });
  };

  const handleTextFormatChange = (
    format: "lowercase" | "none" | "uppercase",
  ) => {
    setTextFormat(format);
    // Note: text transform is handled in the caption rendering
    updateGlobalStyles({ textTransform: format });
  };

  const handleShadowChange = (
    shadow: "large" | "medium" | "none" | "small",
  ) => {
    setTextShadow(shadow);
    updateGlobalStyles({ shadow });
  };

  return (
    <div className="space-y-6">
      <FontTemplates />

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Size</label>
        <div className="flex items-center gap-4">
          <span className="w-12 text-sm text-muted-foreground">
            {fontSize}px
          </span>
          <Slider
            max={72}
            min={12}
            onValueChange={handleFontSizeChange}
            step={1}
            value={[fontSize]}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Color</label>
          <Compact
            color={fontColor}
            onChange={(color) => handleColorChange(color.hex)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="w-full space-y-2">
        <label className="text-sm font-medium">Text Format</label>
        <div className="flex w-full gap-2">
          <Button
            className="flex-1"
            onClick={() => handleTextFormatChange("none")}
            variant={textFormat === "none" ? "default" : "outline"}
          >
            None
          </Button>
          <Button
            className="flex-1"
            onClick={() => handleTextFormatChange("lowercase")}
            variant={textFormat === "lowercase" ? "default" : "outline"}
          >
            Lower
          </Button>
          <Button
            className="flex-1"
            onClick={() => handleTextFormatChange("uppercase")}
            variant={textFormat === "uppercase" ? "default" : "outline"}
          >
            Upper
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Shadow</label>
        <div className="flex gap-2">
          {["none", "small", "medium", "large"].map((size) => (
            <Button
              className="flex-1"
              key={size}
              onClick={() =>
                handleShadowChange(
                  size as "large" | "medium" | "none" | "small",
                )
              }
              variant={textShadow === size ? "default" : "outline"}
            >
              {size === "none" ? "None" : size.charAt(0).toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
