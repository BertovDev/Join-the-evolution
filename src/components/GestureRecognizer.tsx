import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";

import Webcam from "./Webcam";
import { GestureResult } from "../types";
import GameManager from "../GameManager";
import { animate } from "motion";

export default function GestureRecognizerComponent() {
  const [gesture, setGesture] = useState<GestureResult | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const sequence: any = [
      [".loading-bar", { width: "100%" }],
      [".loading-info", { opacity: 0 }],
      [".camera-button", { opacity: 1 }],
    ];

    const init = () => {
      workerRef.current = new Worker(new URL("../worker.ts", import.meta.url));
      try {
        console.log("Try worker ", workerRef.current);
        if (workerRef.current) {
          workerRef.current.postMessage({ action: "init" });

          workerRef.current.addEventListener(
            "message",
            (event: MessageEvent) => {
              const result = event.data;

              if (result === "DONE") {
                if (loaderRef.current) {
                  animate(sequence);
                }
              } else if (
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
      <div
        ref={loaderRef}
        className="bg-[#0a0a0a] loader-container w-full h-full absolute z-30"
      >
        <div className="flex flex-col h-full w-full  justify-center items-center">
          <div className="flex flex-col h-full justify-center loading-info">
            <h1 className="text-xl font-mono">
              Joining the glorious evolution
            </h1>
            <span className="w-0 border loading-bar"></span>
          </div>
          <div className=" flex font-mono w-full justify-end p-2 text-yellow-400">
            Tip: Reload the page if it takes too much time{" "}
          </div>
        </div>
      </div>

      <Webcam onFrame={processFrame} />
      <GameManager gesture={gesture} />
    </>
  );
}
