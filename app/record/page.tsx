"use client"; // Mark this file as a Client Component

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import micImg from "@/public/mic.png";
import videoImg from "@/public/facetime.png";

const RecordPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [volume, setVolume] = useState(0);

  const ellipsesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording) {
      startAudioVisualization();
    } else {
      stopAudioVisualization();
    }
  }, [isRecording]);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyserNode);
      analyserNode.fftSize = 256;

      setAudioContext(audioCtx);
      setAnalyser(analyserNode);

      visualizeAudio(analyserNode);
    } catch (err) {
      console.error("Error accessing audio input:", err);
    }
  };

  const visualizeAudio = (analyserNode: AnalyserNode) => {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    const renderFrame = () => {
      if (analyserNode) {
        analyserNode.getByteFrequencyData(dataArray);
        const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(averageVolume / 255); // Normalize between 0 and 1
      }
      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  const stopAudioVisualization = () => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setAnalyser(null);
    }
    setVolume(0);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0c22] text-white">
      {/* Top Half: Video Streaming */}
      <div className="flex justify-center items-center py-5">
        <div className="relative w-[300px] h-[200px] bg-black rounded-lg shadow-lg overflow-hidden">
          <video className="w-full h-full object-cover" controls autoPlay muted>
            <source src="/video/stream.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-3 right-3">
            <Image src={videoImg} alt="Video Streaming" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Bottom Half: Recording Controls */}
      <div className="flex-1 bg-[#1a192b] p-8 flex flex-col justify-center items-center space-y-5 rounded-t-lg">
        <h2 className="text-3xl font-bold text-gray-300">Voice Recording Controls</h2>

        {/* Recording Buttons */}
        <div className="flex gap-6">
          {!isRecording ? (
            <button onClick={handleStartRecording} className="glass-button text-white">
              Start Recording
            </button>
          ) : (
            <button onClick={handleStopRecording} className="glass-button text-white">
              Stop Recording
            </button>
          )}
        </div>

        {/* Ellipse Animation */}
        <div ref={ellipsesRef} className="flex gap-3 mt-8">
          <div
            className="ellipse"
            style={{
              width: `${30 + volume * 70}px`,
              height: `${30 + volume * 70}px`,
              backgroundColor: "#00FF00",
              borderRadius: "50%",
              transition: "width 0.1s, height 0.1s",
            }}
          />
          <div
            className="ellipse"
            style={{
              width: `${20 + volume * 60}px`,
              height: `${20 + volume * 60}px`,
              backgroundColor: "#FF5733",
              borderRadius: "50%",
              transition: "width 0.1s, height 0.1s",
            }}
          />
          <div
            className="ellipse"
            style={{
              width: `${25 + volume * 65}px`,
              height: `${25 + volume * 65}px`,
              backgroundColor: "#FFC300",
              borderRadius: "50%",
              transition: "width 0.1s, height 0.1s",
            }}
          />
          <div
            className="ellipse"
            style={{
              width: `${35 + volume * 75}px`,
              height: `${35 + volume * 75}px`,
              backgroundColor: "#DAF7A6",
              borderRadius: "50%",
              transition: "width 0.1s, height 0.1s",
            }}
          />
        </div>

        {/* Mic Image */}
        <div className="mt-5">
          <Image src={micImg} alt="Microphone" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
