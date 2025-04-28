/* eslint-disable no-nested-ternary */
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  useMediaState,
} from "@vidstack/react";
import {
  Minimize as FullscreenExitIcon,
  Maximize as FullscreenIcon,
  VolumeX as MuteIcon,
  PauseIcon,
  PictureInPictureIcon as PictureInPictureExitIcon,
  PictureInPicture2 as PictureInPictureIcon,
  PlayIcon,
  SubtitlesIcon,
  Volume2 as VolumeHighIcon,
  Volume1 as VolumeLowIcon,
} from "lucide-react";

export interface MediaButtonProps {
  tooltipAlign?: Tooltip.TooltipContentProps["align"];
  tooltipOffset?: number;
  tooltipSide?: Tooltip.TooltipContentProps["side"];
}

export const buttonClass =
  "group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 focus-visible:ring-4 aria-disabled:hidden";

export const tooltipClass =
  "animate-out fade-out slide-out-to-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in data-[state=delayed-open]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden";

export function Caption({
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MediaButtonProps) {
  const track = useMediaState("textTrack");
  const isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={buttonClass}>
          <SubtitlesIcon
            className={`h-7 w-7 ${!isOn ? "text-white/60" : ""}`}
          />
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        align={tooltipAlign}
        className={tooltipClass}
        side={tooltipSide}
        sideOffset={tooltipOffset}
      >
        {isOn ? "Closed-Captions Off" : "Closed-Captions On"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Fullscreen({
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MediaButtonProps) {
  const isActive = useMediaState("fullscreen");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={buttonClass}>
          {isActive ? (
            <FullscreenExitIcon className="h-7 w-7" />
          ) : (
            <FullscreenIcon className="h-7 w-7" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        align={tooltipAlign}
        className={tooltipClass}
        side={tooltipSide}
        sideOffset={tooltipOffset}
      >
        {isActive ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Mute({
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MediaButtonProps) {
  const volume = useMediaState("volume");
  const isMuted = useMediaState("muted");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={buttonClass}>
          {isMuted || volume === 0 ? (
            <MuteIcon className="h-7 w-7" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="h-7 w-7" />
          ) : (
            <VolumeHighIcon className="h-7 w-7" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        align={tooltipAlign}
        className={tooltipClass}
        side={tooltipSide}
        sideOffset={tooltipOffset}
      >
        {isMuted ? "Unmute" : "Mute"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MediaButtonProps) {
  const isActive = useMediaState("pictureInPicture");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={buttonClass}>
          {isActive ? (
            <PictureInPictureExitIcon className="h-7 w-7" />
          ) : (
            <PictureInPictureIcon className="h-7 w-7" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        align={tooltipAlign}
        className={tooltipClass}
        side={tooltipSide}
        sideOffset={tooltipOffset}
      >
        {isActive ? "Exit PIP" : "Enter PIP"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Play({
  tooltipAlign = "center",
  tooltipOffset = 0,
  tooltipSide = "top",
}: MediaButtonProps) {
  const isPaused = useMediaState("paused");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? (
            <PlayIcon className="h-7 w-7 translate-x-px" />
          ) : (
            <PauseIcon className="h-7 w-7" />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        align={tooltipAlign}
        className={tooltipClass}
        side={tooltipSide}
        sideOffset={tooltipOffset}
      >
        {isPaused ? "Play" : "Pause"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
