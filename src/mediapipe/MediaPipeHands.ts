import {
  Category,
  FilesetResolver,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";
import { Gesture } from "../types";

export const CreateGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 1,
  });

  return gestureRecognizer;
};

export const handleGesture = (
  recognizer: GestureRecognizer,
  videoFrame: HTMLVideoElement,
  timestamp: number
): { gesture: Gesture; confident: number } => {
  const gestures: Category[][] = recognizer.recognizeForVideo(
    videoFrame,
    timestamp
  ).gestures;

  if (!gestures || !gestures.length) {
    return {
      gesture: null,
      confident: 0,
    };
  }

  const confidentScore: number = gestures[0][0].score;
  const categoryName = gestures[0][0].categoryName;
  let mappedGesture: Gesture = null;
  if (categoryName === "Open_Palm") {
    mappedGesture = "Open_Palm";
  } else {
    mappedGesture = "Close_Fist";
  }

  return {
    gesture: mappedGesture,
    confident: confidentScore,
  };
};
