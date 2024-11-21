import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

const CreateGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm "
  );

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
    },
    numHands: 2,
  });

  return gestureRecognizer;
};

export default CreateGestureRecognizer;
