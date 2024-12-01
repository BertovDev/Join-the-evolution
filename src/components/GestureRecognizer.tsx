import { useCallback, useEffect, useRef, useState } from "react";

import Webcam from "./Webcam";
import { GestureResult } from "../types";
import GameManager from "../GameManager";

export default function GestureRecognizerComponent() {
  const [gesture, setGesture] = useState<GestureResult | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const init = () => {
      workerRef.current = new Worker(new URL("../worker.ts", import.meta.url));
      try {
        console.log("Try worker ", workerRef.current);
        if (workerRef.current) {
          workerRef.current.postMessage({ action: "init" });

          workerRef.current.addEventListener(
            "message",
            (event: MessageEvent) => {
              const result = event.data as GestureResult;

              if (
                result.gesture === "Close_Fist" ||
                result.gesture === "Open_Palm"
              ) {
                setGesture(result);
              }
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    init();

    return () => {
      const worker = workerRef.current;
      console.log(worker);
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const processFrame = useCallback(
    (video: ImageBitmap | undefined, timestamp: number) => {
      // if (!recognizer) return;

      try {
        if (workerRef.current === null) {
          console.log("Is null");
        }
        const worker = workerRef.current;
        worker?.postMessage({
          action: "detectForVideo",
          frame: video,
          timestamp: timestamp,
        });
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  return (
    <>
      <Webcam onFrame={processFrame} />
      <GameManager gesture={gesture} />
    </>
  );
}
