import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

import { CompositionProps } from "../../types/constants";
import { getProgress, renderVideo } from "../lambda/api";

export type State =
  | {
      bucketName: string;
      progress: number;
      renderId: string;
      status: "rendering";
    }
  | {
      error: Error;
      renderId: null | string;
      status: "error";
    }
  | {
      size: number;
      status: "done";
      url: string;
    }
  | {
      status: "init";
    }
  | {
      status: "invoking";
    };

const wait = async (milliSeconds: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSeconds);
  });
};

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>,
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({
      status: "invoking",
    });
    try {
      const { bucketName, renderId } = await renderVideo({ id, inputProps });
      setState({
        bucketName,
        progress: 0,
        renderId,
        status: "rendering",
      });

      let pending = true;

      while (pending) {
        // eslint-disable-next-line no-await-in-loop
        const result = await getProgress({
          bucketName,
          id: renderId,
        });
        // eslint-disable-next-line default-case
        switch (result.type) {
          case "done": {
            setState({
              size: result.size,
              status: "done",
              url: result.url,
            });
            pending = false;
            break;
          }
          case "error": {
            setState({
              error: new Error(result.message),
              renderId,
              status: "error",
            });
            pending = false;
            break;
          }
          case "progress": {
            setState({
              bucketName,
              progress: result.progress,
              renderId,
              status: "rendering",
            });
            // eslint-disable-next-line no-await-in-loop
            await wait(1000);
          }
        }
      }
    } catch (err) {
      setState({
        error: err as Error,
        renderId: null,
        status: "error",
      });
    }
  }, [id, inputProps]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
};
