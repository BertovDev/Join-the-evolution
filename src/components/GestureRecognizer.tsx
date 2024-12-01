import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";

import Webcam from "./Webcam";
import { GestureResult } from "../types";
import GameManager from "../GameManager";
import { animate } from "motion";

export default function GestureRecognizerComponent() {
  const [gesture, setGesture] = useState<GestureResult | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isWorkerCreated, setIsWorkerCreated] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const sequence: any = [
      [".loading-bar", { width: "100%" }],
      [".loading-info", { opacity: 0 }],
      [".camera-button", { opacity: 1 }],
      // [
      //   ".loader-container ",
      //   {
      //     opacity: 0,
      //   },
      // ],
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

  const handleCameraInit = () => {
    const startSequence: any = [
      [".camera-button", { opacity: 0 }],
      ".start-button",
      { opacity: 1 },
    ];
    animate(startSequence);
  };

  return (
    <>
      <div
        ref={loaderRef}
        className="bg-[#0a0a0a] loader-container  w-full h-full absolute z-30"
      >
        <div className="flex flex-col h-full w-full  justify-center items-center">
          <div className="flex flex-col loading-info">
            <h1 className="text-xl font-mono">
              Joining the glorious evolution
            </h1>
            <span className="w-0 border loading-bar"></span>
          </div>
          <button
            onClick={() => setIsCameraOn(true)}
            className="font-mono p-2 border rounded-xl z-50 camera-button opacity-0"
          >
            Init Camera
          </button>
          <button
            onClick={() => animate(".loader-container", { opacity: 0 })}
            className="font-mono p-2 border rounded-xl z-50  opacity-0 start-button"
          >
            Start
          </button>
        </div>
      </div>

      <Webcam
        onCameraStart={handleCameraInit}
        onFrame={processFrame}
        isCameraOn={isCameraOn}
      />
      <GameManager gesture={gesture} />
    </>
  );
}
