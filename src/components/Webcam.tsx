import {
  GestureRecognizer,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import React, { useEffect, useState } from "react";

interface WebcamProps {
  gestureRecognizer: GestureRecognizer | undefined;
}

export default function Webcam({ gestureRecognizer }: WebcamProps) {
  let lastVideoTime = -1;
  let gestureRecognitionResult: GestureRecognizerResult | undefined = undefined;

  const videoRef = React.createRef<HTMLVideoElement>();
  const [hasCamera, setHasCamera] = useState(true);
  // const [recoginitionResult, setRecoginitionResult] =
  //   useState<GestureRecognizerResult>();

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const handleWebCam = async () => {
    if (!hasMediaDevices()) return;

    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream: MediaStream) => {
          console.log(stream);
          if (videoRef.current === undefined || videoRef.current === null)
            return;
          videoRef.current.srcObject = stream;
          // videoRef.current.addEventListener("loadeddata", preddictWebcam);
        });
    } catch (err) {
      console.log("Camera not found");
      setHasCamera(false);
    }
  };

  useEffect(() => {
    const renderLoop = () => {
      let time: number = Date.now();
      if (videoRef.current?.currentTime != lastVideoTime && videoRef.current) {
        gestureRecognitionResult = gestureRecognizer?.recognizeForVideo(
          videoRef.current,
          time
        );
        lastVideoTime = videoRef.current.currentTime;
      }

      requestAnimationFrame(() => {
        renderLoop();
      });

      if (gestureRecognitionResult !== undefined) {
        console.log(gestureRecognitionResult);
      }
    };

    renderLoop();
  }, []);

  return (
    <div className="h-1/4 absolute top-0 left-0 z-10">
      <div className="relative top-0 bottom-0 w-1/2 h-1/2 bg-red-200">
        <video ref={videoRef} id="webcam" autoPlay playsInline muted></video>
      </div>
      <div className="flex flex-col justify-center  items-center">
        <button className="" onClick={handleWebCam}>
          Enable Webcam
        </button>
        {!hasCamera && <span className="text-red-600">Camera not found</span>}
      </div>
    </div>
  );
}
