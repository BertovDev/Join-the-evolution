import { useCallback, useEffect, useState } from "react";
import {
  CreateGestureRecognizer,
  handleGesture,
} from "../mediapipe/MediaPipeHands";
import Webcam from "./Webcam";
import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { GestureResult } from "../types";
import GameManager from "../GameManager";

export default function GestureRecognizerComponent() {
  const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
  const [gesture, setGesture] = useState<GestureResult | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const recognizer = await CreateGestureRecognizer();
        setRecognizer(recognizer);
      } catch (err) {
        console.log(err);
      }
    };

    init();

    return () => {
      if (recognizer) {
        recognizer.close();
      }
    };
  }, []);

  const processFrame = useCallback(
    (video: HTMLVideoElement, timestamp: number) => {
      if (!recognizer) return;

      try {
        const result: GestureResult = handleGesture(
          recognizer,
          video,
          timestamp
        );

        if (result) {
          setGesture(result);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [recognizer]
  );

  return (
    <>
      <Webcam onFrame={processFrame} />
      <GameManager gesture={gesture} />
    </>
  );
}
