import React, { useState } from "react";

export default function Webcam() {
  const videoRef = React.createRef<HTMLVideoElement>();
  const [hasCamera, setHasCamera] = useState(true);

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

  return (
    <div className="h-1/4 absolute top-0 left-0 z-10">
      <div className="relative top-0 bottom-0 w-full h-full bg-red-200">
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
