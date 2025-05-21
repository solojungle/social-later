/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-continue */
import { Audio, Img, Layout, makeScene2D, Rect, Txt } from "@revideo/2d";
import {
  all,
  createRef,
  createSignal,
  makeProject,
  Reference,
  useScene,
  waitFor,
} from "@revideo/core";

import metadata from "./metadata.json";
import "./global.css";

interface CaptionSettings {
  borderColor?: string;
  borderWidth?: number;
  currentWordBackgroundColor?: string;
  currentWordColor?: string;
  fadeInAnimation?: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  numSimultaneousWords: number;
  shadowBlur?: number;
  shadowColor?: string;
  stream: boolean;
  textAlign: "center" | "left";
  textBoxWidthInPercent: number;
  textColor: string;
}

interface Word {
  end: number;
  punctuated_word: string;
  start: number;
}

const textSettings: CaptionSettings = {
  currentWordBackgroundColor: "red",
  currentWordColor: "cyan",
  fadeInAnimation: true,
  fontFamily: "Mulish",
  fontSize: 80,
  fontWeight: 800,
  numSimultaneousWords: 4,
  shadowBlur: 30,
  shadowColor: "black",
  stream: false,
  textAlign: "center",
  textBoxWidthInPercent: 70,
  textColor: "white",
};

/**
 * The Revideo scene
 */
const scene = makeScene2D("scene", function* (view) {
  const images = useScene().variables.get("images", [])();
  const audioUrl = useScene().variables.get("audioUrl", "none")();
  const words = useScene().variables.get("words", [])();

  if (!words.length) {
    throw new Error("No words provided");
  }

  const duration = (words[words.length - 1] as unknown as Word).end + 0.5;

  const imageContainer = createRef<Layout>();
  const textContainer = createRef<Layout>();

  const rootLayout = new Layout({ size: "100%" });
  const imageLayout = new Layout({ ref: imageContainer, size: "100%" });
  const textLayout = new Layout({ ref: textContainer, size: "100%" });
  const mainAudio = new Audio({ play: true, src: audioUrl });
  const backgroundAudio = new Audio({
    play: true,
    src: "https://revideo-example-assets.s3.amazonaws.com/chill-beat-2.mp3",
    volume: 0.1,
  });

  rootLayout.add(imageLayout);
  rootLayout.add(textLayout);
  rootLayout.add(mainAudio);
  rootLayout.add(backgroundAudio);
  yield view.add(rootLayout);

  yield* all(
    displayImages(imageContainer, images, duration),
    displayWords(textContainer, words, textSettings),
  );
});

function* displayImages(
  container: Reference<Layout>,
  images: string[],
  totalDuration: number,
) {
  for (const img of images) {
    const ref = createRef<Img>();
    container().add(
      new Img({
        ref,
        size: ["100%", "100%"],
        src: img,
        zIndex: 0,
      }),
    );
    yield* waitFor(totalDuration / images.length);
  }
}

function* displayWords(
  container: Reference<Layout>,
  words: Word[],
  settings: CaptionSettings,
) {
  if (!words.length) {
    return;
  }

  let waitBefore = words[0]?.start || 0;

  for (let i = 0; i < words.length; i += settings.numSimultaneousWords) {
    const currentBatch = words.slice(i, i + settings.numSimultaneousWords);
    if (!currentBatch.length) continue;

    const nextClipStart =
      i < words.length - 1
        ? words[i + settings.numSimultaneousWords]?.start || null
        : null;
    const isLastClip = i + settings.numSimultaneousWords >= words.length;
    const waitAfter = isLastClip ? 1 : 0;
    const textRef = createRef<Txt>();
    yield* waitFor(waitBefore);

    if (settings.stream) {
      let nextWordStart = 0;
      const textContainer = new Txt({
        ref: textRef,
        textAlign: settings.textAlign,
        textWrap: true,
        width: `${settings.textBoxWidthInPercent}%`,
        zIndex: 2,
      });
      const containerRef = container();
      if (!containerRef) continue;
      yield containerRef.add(textContainer);

      for (let j = 0; j < currentBatch.length; j += 1) {
        const word = currentBatch[j];
        if (!word) continue;

        yield* waitFor(nextWordStart);
        const optionalSpace = j === currentBatch.length - 1 ? "" : " ";
        const backgroundRef = createRef<Rect>();
        const wordRef = createRef<Txt>();
        const opacitySignal = createSignal(settings.fadeInAnimation ? 0.5 : 1);
        const wordText = new Txt({
          children: word.punctuated_word,
          fill: settings.currentWordColor || settings.textColor,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          fontWeight: settings.fontWeight,
          lineWidth: settings.borderWidth,
          opacity: opacitySignal,
          ref: wordRef,
          shadowBlur: settings.shadowBlur,
          shadowColor: settings.shadowColor,
          stroke: settings.borderColor,
          textAlign: settings.textAlign,
          textWrap: true,
          zIndex: 2,
        });
        const textRefInstance = textRef();
        if (!textRefInstance) continue;
        textRefInstance.add(wordText);
        textRefInstance.add(
          new Txt({ children: optionalSpace, fontSize: settings.fontSize }),
        );
        const wordRefInstance = wordRef();
        if (!wordRefInstance) continue;
        const background = new Rect({
          fill: settings.currentWordBackgroundColor || "transparent",
          padding: 10,
          position: wordRefInstance.position,
          radius: 10,
          ref: backgroundRef,
          size: wordRefInstance.size,
          zIndex: 1,
        });
        containerRef.add(background);
        yield* all(
          waitFor(word.end - word.start),
          opacitySignal(1, Math.min((word.end - word.start) * 0.5, 0.1)),
        );
        wordRefInstance.fill(settings.textColor);
        backgroundRef().remove();
        const nextWord = currentBatch[j + 1];
        nextWordStart = nextWord ? nextWord.start - word.end : 0;
      }
      const textRefInstance = textRef();
      if (textRefInstance) {
        textRefInstance.remove();
      }
    } else {
      const textContainer = new Txt({
        ref: textRef,
        textAlign: settings.textAlign,
        textWrap: true,
        width: `${settings.textBoxWidthInPercent}%`,
        zIndex: 2,
      });
      const containerRef = container();
      if (!containerRef) continue;
      yield containerRef.add(textContainer);

      const wordRefs: Reference<Txt>[] = [];
      const opacitySignal = createSignal(settings.fadeInAnimation ? 0.5 : 1);
      for (let j = 0; j < currentBatch.length; j += 1) {
        const word = currentBatch[j];
        if (!word) continue;

        const optionalSpace = j === currentBatch.length - 1 ? "" : " ";
        const wordRef = createRef<Txt>();
        const wordText = new Txt({
          children: word.punctuated_word,
          fill: settings.textColor,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          fontWeight: settings.fontWeight,
          lineWidth: settings.borderWidth,
          opacity: opacitySignal,
          ref: wordRef,
          shadowBlur: settings.shadowBlur,
          shadowColor: settings.shadowColor,
          stroke: settings.borderColor,
          textAlign: settings.textAlign,
          textWrap: true,
          zIndex: 2,
        });
        const textRefInstance = textRef();
        if (!textRefInstance) continue;
        textRefInstance.add(wordText);
        textRefInstance.add(
          new Txt({ children: optionalSpace, fontSize: settings.fontSize }),
        );

        if (j === 0 && i === 0) {
          yield;
        }
        wordRefs.push(wordRef);
      }

      if (currentBatch.length > 0 && currentBatch[0]) {
        yield* all(
          opacitySignal(
            1,
            Math.min(0.1, (currentBatch[0].end - currentBatch[0].start) * 0.5),
          ),
          highlightCurrentWord(
            container,
            currentBatch,
            wordRefs,
            settings.currentWordColor || settings.textColor,
            settings.currentWordBackgroundColor || "transparent",
          ),
          waitFor(
            (currentBatch[currentBatch.length - 1]?.end ?? 0) -
              (currentBatch[0]?.start ?? 0) +
              waitAfter,
          ),
        );
      }
      const textRefInstance = textRef();
      if (textRefInstance) {
        textRefInstance.remove();
      }
    }
    waitBefore =
      nextClipStart !== null &&
      currentBatch.length > 0 &&
      currentBatch[currentBatch.length - 1]
        ? nextClipStart -
          (currentBatch[currentBatch.length - 1] as unknown as Word).end
        : 0;
  }
}

function* highlightCurrentWord(
  container: Reference<Layout>,
  currentBatch: Word[],
  wordRefs: Reference<Txt>[],
  wordColor: string,
  backgroundColor: string,
) {
  let nextWordStart = 0;

  for (let i = 0; i < currentBatch.length; i += 1) {
    const word = currentBatch[i];
    if (!word || !wordRefs[i]) continue;
    yield* waitFor(nextWordStart);
    const wordRef = wordRefs[i]?.();
    if (!wordRef) continue;
    const originalColor = wordRef.fill();
    const nextWord = currentBatch[i + 1];
    nextWordStart = nextWord ? nextWord.start - word.end : 0;
    wordRef.text(wordRef.text());
    wordRef.fill(wordColor);

    const backgroundRef = createRef<Rect>();
    if (backgroundColor) {
      const background = new Rect({
        fill: backgroundColor,
        padding: 10,
        position: wordRef.position,
        radius: 10,
        ref: backgroundRef,
        size: wordRef.size,
        zIndex: 1,
      });
      const containerRef = container();
      if (!containerRef) continue;
      containerRef.add(background);
    }

    yield* waitFor(word.end - word.start);
    wordRef.text(wordRef.text());
    wordRef.fill(originalColor);

    if (backgroundColor) {
      const backgroundRefInstance = backgroundRef();
      if (backgroundRefInstance) {
        backgroundRefInstance.remove();
      }
    }
  }
}

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    shared: {
      size: { x: 1920, y: 1080 },
    },
  },
  variables: metadata,
});
