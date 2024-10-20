import { useRef, useEffect, useState, useCallback } from "react";

interface VideoPlayerProps {
  setNewDescription: (description: string) => void;  // Function to be passed as a prop
}


export default function VideoPlayer({ setNewDescription }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const frameCaptureIntervalRef = useRef<number | null>(null);

  // Start the camera feed
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Error accessing the camera: " + err);
      }
    };

    startCamera();

    return () => {
      if (frameCaptureIntervalRef.current) {
        clearInterval(frameCaptureIntervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture a frame from the video feed and upload it
  const captureAndUploadFrame = useCallback(async () => {
    if (!videoRef.current) {
      setError("Video element not found.");
      return;
    }

    const video = videoRef.current;

    // Ensure the video has loaded enough to capture a frame
    if (video.readyState < 2) {
      console.error("Video is not ready to capture a frame.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    const context = canvas.getContext("2d");
    if (context) {
      context.translate(canvas.width, 0); // Move the canvas origin to the right
      context.scale(-1, 1); // Flip the canvas horizontally
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: imageData }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        console.log("Frame uploaded successfully.");
        const result = await response.json()
        setNewDescription(result["description"])
      } catch (error) {
        console.error("Error uploading frame:", error);
        setError("Error uploading frame.");
      }
    } else {
      setError("Could not get canvas context.");
    }
  }, []);

  // Start capturing frames every 5 seconds
  useEffect(() => {
    frameCaptureIntervalRef.current = window.setInterval(captureAndUploadFrame, 5000);

    return () => {
      if (frameCaptureIntervalRef.current) {
        clearInterval(frameCaptureIntervalRef.current);
      }
    };
  }, [captureAndUploadFrame]);

  return (
    <div className="flex flex-col bg-black text-neon-green font-orbitron">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-auto object-contain transform -scale-x-100" // Mirrors the video horizontally
        />
        {error && <p className="text-red-500 mt-2 flex flex-row justify-around">{error}</p>}
      </div>
    </div>
  );
}
