import { useCallback, useState } from "react";
import "./App.css";
import Webcam from "./components/Webcam";
import GameManager from "./GameManager";

function App() {
  const [gestures, setGestures] = useState<string>();

  const handleGesture = useCallback(
    (data: string) => {
      setGestures(data);
      console.log(data);
    },
    [gestures]
  );

  return (
    <>
      <Webcam onGesture={handleGesture} />
      <GameManager gestures={gestures} />
    </>
  );
}

export default App;
