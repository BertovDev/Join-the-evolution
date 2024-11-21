import { useState } from "react";
import "./App.css";
import Webcam from "./components/Webcam";
import GameManager from "./GameManager";
import CreateGestureRecognizer from "./mediapipe/MediaPipeHands";
import { GestureRecognizer } from "@mediapipe/tasks-vision";

function App() {
  const [gestureRecognizer, setGestureRecognizer] =
    useState<GestureRecognizer>();

  const handleGestureRecognizer = async () => {
    const recognizer = await CreateGestureRecognizer();
    recognizer.setOptions({
      runningMode: "VIDEO",
    });

    setGestureRecognizer(recognizer);
  };

  return (
    <>
      <Webcam gestureRecognizer={gestureRecognizer} />
      <GameManager />
      <div onClick={handleGestureRecognizer}>Create Gesture Recognizer</div>
    </>
  );
}

export default App;
