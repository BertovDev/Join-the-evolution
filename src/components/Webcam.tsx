import { Category, GestureRecognizer } from "@mediapipe/tasks-vision";
import React, { useEffect, useState } from "react";
import CreateGestureRecognizer from "../mediapipe/MediaPipeHands";
import { Camera as CameraPipe } from "@mediapipe/camera_utils";

export default function Webcam({}) {
  const videoRef = React.createRef<HTMLVideoElement>();
  const [hasCamera, setHasCamera] = useState(true);
  const [gesture, setGesture] = useState<string>("");

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  useEffect(() => {
    const handleGesturesRecognizer = async () => {
      if (videoRef.current) {
        const gestureRecognizer: GestureRecognizer =
          await CreateGestureRecognizer();

        const camera = new CameraPipe(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              const time: number = Date.now();

              const gestures: Category[][] =
                gestureRecognizer.recognizeForVideo(
                  videoRef.current,
                  time
                ).gestures;

              if (gestures && gestures.length > 0) {
                const category: string = gestures[0][0].categoryName;
                console.log(category);
                // onGestureRecognition(category);
              }
            }
          },
        });
        camera.start();
      }
    };

    const EnableCamera = async () => {
      if (!hasMediaDevices()) return;
      // const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      // });
      if (videoRef.current !== undefined && videoRef.current !== null) {
        // videoRef.current.srcObject = stream;
        await handleGesturesRecognizer();
      }
    };

    EnableCamera();
  }, []);

  return (
    <div className="h-1/4 absolute top-0 left-0 z-10">
      <div className="relative top-0 bottom-0 w-1/5 h-1/5 bg-red-200">
        <video ref={videoRef} id="webcam" autoPlay playsInline muted></video>
      </div>
      <div className="flex flex-col justify-center  items-center">
        {/* <button className="" onClick={async () => await handleWebCam()}>
          Enable Webcam
        </button> */}
        {!hasCamera && <span className="text-red-600">Camera not found</span>}
      </div>
    </div>
  );
}
