import {
  GestureRecognizer,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CreateGestureRecognizer from "../mediapipe/MediaPipeHands";

interface WebCamProps {
  onGesture: (data: string) => void;
}

export default function Webcam({ onGesture }: WebCamProps) {
  const videoRef = React.createRef<HTMLVideoElement>();
  const [hasCamera, setHasCamera] = useState(true);

  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const frameRef = useRef<number | null>();
  const isRunninRef = useRef<boolean>(false);

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const animate = useCallback(() => {
    if (videoRef.current && recognizerRef.current) {
      try {
        const time: number = Date.now();
        const result: GestureRecognizerResult =
          recognizerRef.current.recognizeForVideo(videoRef.current, time);

        if (result.gestures.length > 0) {
          const gestureCategory: string = result.gestures[0][0].categoryName;
          onGesture(gestureCategory);
        }

        if (isRunninRef.current) {
          frameRef.current = requestAnimationFrame(animate);
        }
      } catch (err) {
        console.log(err);
        isRunninRef.current = false;
      }
    } else {
      if (isRunninRef.current) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }
  }, [onGesture]);

  const startAnimation = useCallback(() => {
    isRunninRef.current = true;
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stopAnimation = useCallback(() => {
    isRunninRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAnimation();

    return () => {
      stopAnimation();
      if (frameRef.current) {
        recognizerRef.current?.close();
        recognizerRef.current = null;
      }
    };
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const enableCamera = async () => {
      if (!hasMediaDevices()) return;

      const steam: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current !== undefined && videoRef.current !== null) {
        videoRef.current.srcObject = steam;
        const recognizer = await CreateGestureRecognizer();
        recognizerRef.current = recognizer;
        videoRef.current.play();
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
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
