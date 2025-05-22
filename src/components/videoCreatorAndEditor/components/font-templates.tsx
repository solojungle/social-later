/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { InterfaceIcons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";

export function FontTemplates() {
  const { globalStyles, updateGlobalStyles } = useEditorStore();

  const fonts = [
    {
      className: "font-inter",
      name: "Inter",
    },
    {
      className: "font-roboto",
      name: "Roboto",
    },
    {
      className: "font-opensans",
      name: "Open Sans",
    },
    {
      className: "font-montserrat",
      name: "Montserrat",
    },
    {
      className: "font-lato",
      name: "Lato",
    },
    {
      className: "font-poppins",
      name: "Poppins",
    },
  ];

  const sampleText = "The quick brown fox jumps over the lazy dog";

  return (
    <div className="">
      <h3 className="mb-2 font-medium">Caption Font</h3>
      <div className="grid grid-cols-2 gap-1">
        {fonts.map((font) => (
          <div
            className={cn(
              "relative cursor-pointer rounded-lg border p-4 hover:bg-accent",
              globalStyles.fontFamily === font.name &&
                "border-primary bg-accent",
            )}
            key={font.name}
            onClick={() => updateGlobalStyles({ fontFamily: font.name })}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{font.name}</p>
                {globalStyles.fontFamily === font.name && (
                  <InterfaceIcons.Selected className="size-4 text-primary" />
                )}
              </div>
              <p
                className={cn("text-sm text-muted-foreground", font.className)}
              >
                {sampleText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
