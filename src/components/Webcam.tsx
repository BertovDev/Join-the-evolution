import React, { useCallback, useEffect, useRef, useState } from "react";

interface WebCamProps {
  onFrame: (videoFrame: HTMLVideoElement, timestamp: number) => void;
}

const Webcam: React.FC<WebCamProps> = ({ onFrame }) => {
  const videoRef = React.createRef<HTMLVideoElement>();
  const lastVideoTime = useRef<number>(-1);
  const [hasCamera, setHasCamera] = useState(true);

  const hasMediaDevices = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const processFrame = useCallback(() => {
    if (videoRef.current && videoRef.current.currentTime > 4) {
      const currentTime = videoRef.current.currentTime;

      if (currentTime > lastVideoTime.current) {
        lastVideoTime.current = currentTime;
        onFrame(videoRef.current, currentTime * 1000);
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
      </div>
      <div className="flex flex-col justify-center  items-center">
        {!hasCamera && <span className="text-red-600">Camera not found</span>}
      </div>
    </div>
  );
};

export default React.memo(Webcam);
