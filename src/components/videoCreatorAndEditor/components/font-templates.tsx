/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";

export function FontTemplates() {
  const { updateGlobalStyles } = useEditorStore();

  const fonts = [
    {
      className: "font-coolvetica",
      name: "Coolvetica",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "medium",
        textTransform: "uppercase",
      },
    },
    {
      className: "font-montserrat-bold",
      name: "Montserrat Bold",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "small",
        textTransform: "none",
      },
    },
    {
      className: "font-bebas-neue",
      name: "Bebas Neue",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "large",
        textTransform: "uppercase",
      },
    },
    {
      className: "font-pacifico",
      name: "Pacifico",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "none",
        textTransform: "none",
      },
    },
    {
      className: "font-anton",
      name: "Anton",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "medium",
        textTransform: "uppercase",
      },
    },
    {
      className: "font-playfair",
      name: "Playfair Display",
      style: {
        color: "#FFFFFF", // White
        fontSize: 28,
        shadow: "none",
        textTransform: "none",
      },
    },
  ];

  return (
    <div className="">
      <h3 className="mb-2 text-sm font-medium">Caption Font</h3>
      <div className="grid grid-cols-2 gap-1">
        {fonts.map((font) => (
          <div
            className={cn(
              "relative cursor-pointer rounded-lg border bg-background p-4 text-foreground hover:bg-accent",
            )}
            key={font.name}
            onClick={() => {
              updateGlobalStyles({
                fontFamily: font.name,
              });
            }}
          >
            <div className="space-y-2">
              <p className={cn(font.className, "text-xl")}>{font.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
