import { z } from "zod";

import { COMP_NAME, CompositionProps } from "../../types/constants";
import { useRendering } from "../helpers/use-rendering";
import { AlignEnd } from "./align-end";
import { Button } from "./button";
import { InputContainer } from "./container";
import { DownloadButton } from "./download-button";
import { ErrorComp } from "./error";
import { Input } from "./input";
import { ProgressBar } from "./progress-bar";
import { Spacing } from "./spacing";

export const RenderControls: React.FC<{
  inputProps: z.infer<typeof CompositionProps>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}> = ({ inputProps, setText, text }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <Input
            disabled={state.status === "invoking"}
            setText={setText}
            text={text}
          />
          <Spacing />
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message} />
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing />
          <AlignEnd>
            <DownloadButton state={state} undo={undo} />
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
