import { useState } from "react";
import "./App.css";
import Webcam from "./components/Webcam";
import GameManager from "./GameManager";

function App() {
  const [gestures, setGestures] = useState<string>();

  return (
    <>
      <Webcam />
      <GameManager gestures={gestures} />
    </>
  );
}

export default App;
