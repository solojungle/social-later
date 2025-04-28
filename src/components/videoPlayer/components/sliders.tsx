import * as Slider from "@radix-ui/react-slider";
import {
  formatTime,
  Thumbnail,
  useMediaRemote,
  useMediaState,
  useSliderPreview,
} from "@vidstack/react";
import { useEffect, useState } from "react";

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  const time = useMediaState("currentTime");
  const canSeek = useMediaState("canSeek");
  const duration = useMediaState("duration");
  const seeking = useMediaState("seeking");
  const remote = useMediaRemote();
  const step = (1 / duration) * 100;
  const [value, setValue] = useState(0);
  const { previewRef, previewRootRef, previewValue } = useSliderPreview({
    clamp: true,
    offset: 6,
    orientation: "horizontal",
  });
  const previewTime = (previewValue / 100) * duration;

  // Keep slider value in-sync with playback.
  useEffect(() => {
    if (seeking) return;
    setValue((time / duration) * 100);
  }, [time, duration, seeking]);

  return (
    <Slider.Root
      className="group relative inline-flex h-9 w-full cursor-pointer touch-none select-none items-center outline-none"
      disabled={!canSeek}
      onValueChange={([v]) => {
        setValue(v ?? 0);
        remote.seeking((v ?? 0 / 100) * duration);
      }}
      onValueCommit={([v]) => {
        remote.seek((v ?? 0 / 100) * duration);
      }}
      ref={previewRootRef}
      step={Number.isFinite(step) ? step : 1}
      value={[value]}
    >
      <Slider.Track className="relative h-[5px] w-full rounded-sm bg-white/30">
        <Slider.Range className="absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>

      <Slider.Thumb
        aria-label="Current Time"
        className="group-hocus:opacity-100 block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white opacity-0 outline-none ring-white/40 transition-opacity will-change-[left] focus:opacity-100 focus:ring-4"
      />

      {/* Preview */}
      <div
        className="pointer-events-none absolute flex flex-col items-center opacity-0 transition-opacity duration-200 will-change-[left] data-[visible]:opacity-100"
        ref={previewRef}
      >
        {thumbnails ? (
          <Thumbnail.Root
            className="mb-2 block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
            src={thumbnails}
            time={previewTime}
          >
            <Thumbnail.Img />
          </Thumbnail.Root>
        ) : null}
        <span className="text-[13px]">{formatTime(previewTime)}</span>
      </div>
    </Slider.Root>
  );
}

export function Volume() {
  const volume = useMediaState("volume");
  const canSetVolume = useMediaState("canSetVolume");
  const remote = useMediaRemote();

  if (!canSetVolume) return null;

  return (
    <Slider.Root
      className="group relative inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none"
      onValueChange={([value]) => {
        remote.changeVolume(value ?? 0 / 100);
      }}
      value={[volume * 100]}
    >
      <Slider.Track className="relative h-[5px] w-full rounded-sm bg-white/30">
        <Slider.Range className="absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>
      <Slider.Thumb
        aria-label="Volume"
        className="group-hocus:opacity-100 block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white opacity-0 outline-none ring-white/40 transition-opacity will-change-[left] focus:opacity-100 focus:ring-4"
      />
    </Slider.Root>
  );
}
