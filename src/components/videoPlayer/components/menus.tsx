import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContentProps,
  DropdownMenuRadioItemProps,
} from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useCaptionOptions, useMediaPlayer } from "@vidstack/react";
import { CheckCircle, CircleIcon, SubtitlesIcon } from "lucide-react";

import { buttonClass, tooltipClass } from "./buttons";

export interface MenuProps {
  align?: DropdownMenuContentProps["align"];
  offset?: DropdownMenuContentProps["sideOffset"];
  side?: DropdownMenuContentProps["side"];
  tooltipAlign?: Tooltip.TooltipContentProps["align"];
  tooltipOffset?: number;
  tooltipSide?: Tooltip.TooltipContentProps["side"];
}

function Radio({ children, ...props }: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenu.RadioItem
      className="hocus:bg-white/10 group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 text-sm outline-none data-[focus]:ring-[3px]"
      {...props}
    >
      <CircleIcon className="h-4 w-4 text-white group-data-[state=checked]:hidden" />
      <CheckCircle className="hidden h-4 w-4 group-data-[state=checked]:block" />
      <span className="ml-2">{children}</span>
    </DropdownMenu.RadioItem>
  );
}

// We can reuse this class for other menus.
const menuClass =
  "animate-out fade-out z-[9999] slide-in-from-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-out-to-bottom-2 flex max-h-[400px] min-w-[260px] flex-col rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm duration-300";

export function Captions({
  align = "end",
  offset = 0,
  side = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MenuProps) {
  const player = useMediaPlayer();
  const options = useCaptionOptions();
  const hint = options.selectedTrack?.label ?? "Off";
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger
            aria-label="Settings"
            className={buttonClass}
            disabled={options.disabled}
          >
            <SubtitlesIcon className="h-7 w-7" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          align={tooltipAlign}
          className={tooltipClass}
          side={tooltipSide}
          sideOffset={tooltipOffset}
        >
          Captions
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        align={align}
        className={menuClass}
        collisionBoundary={player?.el}
        side={side}
        sideOffset={offset}
      >
        <DropdownMenu.Label className="mb-2 flex w-full items-center px-1.5 text-[15px] font-medium">
          <SubtitlesIcon className="mr-1.5 h-5 w-5 translate-y-px" />
          Captions
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-label="Captions"
          className="flex w-full flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, select, value }) => (
            <Radio key={value} onSelect={select} value={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
