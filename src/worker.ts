import { GestureRecognizer } from "@mediapipe/tasks-vision";

(async () => {
  console.log("Worker");
  try {
    const [module1] = await Promise.all([
      import("./mediapipe/MediaPipeHands"),
      import("@mediapipe/tasks-vision"),
    ]);

    // const { CreateGestureRecognizer, handleGesture } = await import(
    //   "./mediapipe/MediaPipeHands"
    // );

    let recognizer: GestureRecognizer | null = null;

    self.onmessage = async (event: MessageEvent) => {
      const data = event.data;

      if (data.action === "init") {
        console.log("init");
        if (!recognizer) {
          const recognizerIsntance = await module1.CreateGestureRecognizer();

          if (!recognizerIsntance) {
            throw new Error("Error on recognizer instance creation.");
          }

          recognizer = recognizerIsntance;
          console.log("Created new recognizer", recognizer);
        } else {
          console.log("recognizer is not set");
        }
      } else if (data.action === "detectForVideo") {
        if (recognizer) {
          const result = module1.handleGesture(
            recognizer,
            data.frame,
            data.timestamp
          );

          self.postMessage(result);
        }
      }
    };
  } catch (err) {
    console.log(err);
  }
})();
