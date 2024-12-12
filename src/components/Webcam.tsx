import { animate } from "motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface WebCamProps {
  onFrame: (videoFrame: HTMLVideoElement, timestamp: number) => void;
}

const Webcam: React.FC<WebCamProps> = ({ onFrame }) => {
  const videoRef = React.createRef<HTMLVideoElement>();
  const offscreen = useRef<OffscreenCanvas>();
  const context = useRef<OffscreenCanvasRenderingContext2D | null>();
  const lastVideoTime = useRef<number>(-1);
  const [hasCamera, setHasCamera] = useState(true);

  const animationRef = useRef<number>();

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  useEffect(() => {
    const processFrame = () => {
      if (
        videoRef.current &&
        offscreen.current &&
        videoRef.current.currentTime > 4
      ) {
        const currentTime = videoRef.current.currentTime;

        if (currentTime > lastVideoTime.current) {
          lastVideoTime.current = currentTime;

          context.current?.drawImage(videoRef.current, 0, 0);
          const imageBitmap: ImageBitmap | undefined =
            offscreen.current?.transferToImageBitmap();

          onFrame(videoRef.current, performance.now());
        }
      }

      animationRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onFrame]);

  const initWebcam = async () => {
    if (!hasMediaDevices) return;

    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        setHasCamera(true);

        videoRef.current.srcObject = stream;
        videoRef.current.play();
        // offscreen.current = canvasRef.current?.transferControlToOffscreen();

        videoRef.current.addEventListener("loadeddata", createOffscreen);
        animate(".camera-button", { opacity: 0 });
        animate(".loader-container", { opacity: 0 });
      }
    } catch (err) {
      console.log(err);
      setHasCamera(false);
    }
  };

  const createOffscreen = () => {
    console.log("Yeah");
    if (videoRef.current) {
      offscreen.current = new OffscreenCanvas(
        videoRef.current?.videoWidth,
        videoRef.current?.videoHeight
      );

      context.current = offscreen.current.getContext("2d", {
        willReadFrequently: true,
      });
    }
  };

  return (
    <>
      <div className="h-1/4 absolute top-0 left-0 pl-2 z-40">
        <div className="relative top-0 bottom-0 w-1/5 h-1/5 ">
          <video ref={videoRef} id="webcam" autoPlay playsInline muted></video>
        </div>
      </div>
      <div className="absolute h-full m-auto left-0 right-0 z-50">
        <div className="flex h-full  flex-col items-center justify-center">
          <button
            onClick={() => {
              initWebcam();
            }}
            className="camera-button font-mono p-2 border rounded-xl z-50 camera-button opacity-0"
          >
            Init Camera
          </button>

          {!hasCamera && <span className="text-red-600">Camera not found</span>}
        </div>
      </div>
    </>
  );
};

export default React.memo(Webcam);
