import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebCamProps {
  onFrame: (
    videoFrame: ImageData | null | undefined,
    timestamp: number
  ) => void;
}

const Webcam: React.FC<WebCamProps> = ({ onFrame }) => {
  const videoRef = React.createRef<HTMLVideoElement>();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const context = useRef<CanvasRenderingContext2D | null>();
  const lastVideoTime = useRef<number>(-1);
  const [hasCamera, setHasCamera] = useState(true);

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const processFrame = useCallback(() => {
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.currentTime > 4
    ) {
      const currentTime = videoRef.current.currentTime;

      if (currentTime > lastVideoTime.current) {
        lastVideoTime.current = currentTime;

        context.current?.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const frame: ImageData | null | undefined =
          context.current?.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

        onFrame(frame, currentTime * 1000);
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

        videoRef.current.srcObject = stream;
        videoRef.current.play();
        context.current = canvasRef.current?.getContext("2d", {
          willReadFrequently: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    initWebcam();
  }, []);

  return (
    <div className="h-1/4 absolute top-0 left-0 z-10">
      <div className="relative top-0 bottom-0 w-1/5 h-1/5 bg-red-200">
        <video ref={videoRef} id="webcam" autoPlay playsInline muted></video>
        <canvas ref={canvasRef} id="canvas" className="hidden"></canvas>
      </div>
      <div className="flex flex-col justify-center  items-center">
        {!hasCamera && <span className="text-red-600">Camera not found</span>}
      </div>
    </div>
  );
};

export default React.memo(Webcam);
