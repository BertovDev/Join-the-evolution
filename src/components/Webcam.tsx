import React, { useCallback, useEffect, useRef, useState } from "react";

interface WebCamProps {
  onFrame: (videoFrame: ImageBitmap | undefined, timestamp: number) => void;
}

const Webcam: React.FC<WebCamProps> = ({ onFrame }) => {
  const videoRef = React.createRef<HTMLVideoElement>();
  const offscreen = useRef<OffscreenCanvas>();
  const context = useRef<OffscreenCanvasRenderingContext2D | null>();
  const lastVideoTime = useRef<number>(-1);
  const [hasCamera, setHasCamera] = useState(true);

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const processFrame = useCallback(() => {
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

        onFrame(imageBitmap, performance.now());
      }
    }

    requestAnimationFrame(processFrame);
  }, [onFrame]);

  useEffect(() => {
    requestAnimationFrame(processFrame);
  }, [processFrame]);

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
      }
    } catch (err) {
      console.log(err);
      setHasCamera(false);
    }
  };

  const createOffscreen = () => {
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
    <div className="h-1/4 absolute top-0 left-0 z-10  pl-2">
      <div className="relative top-0 bottom-0 w-1/5 h-1/5 bg-red-200">
        <video ref={videoRef} id="webcam" autoPlay playsInline muted></video>
      </div>
      <div className="flex flex-col justify-center  items-start">
        <button className=" text-blue-500 " onClick={initWebcam}>
          Init camera
        </button>
        {!hasCamera && <span className="text-red-600">Camera not found</span>}
      </div>
    </div>
  );
};

export default React.memo(Webcam);
