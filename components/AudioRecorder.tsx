"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import replayImg from "@/public/replay.png";
import AudioVisualizer from "./AudioVisualizer";
import WordSlider from "./WordSlider";
import micImg from "@/public/mic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const AudioRecorder = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
    setIsSpinning(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      (event: BlobEvent) => {
        setAudioChunks((prev) => [event.data]);
      }
    );
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsSpinning(false);
    setAudioStream(null);

    // Cleanup media stream to prevent leaks
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const playAudio = () => {
    if (audioChunks.length) {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  };

  const uploadAudio = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", blob, "recorded-audio.wav");

    fetch("/api/uploadaudio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        window.location.href="/home"
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.href="/home"
      });
  };

  return (
    <div>
      <audio ref={audioRef} controls hidden />

      <div>
        {/* Spinner */}
        <div className="spinner-container relative mt-16 md:mt-32 flex justify-center items-center">
          <Image src={micImg} alt="Microphone" className="mic-image absolute" />
          <div
            className="spinner-audio"
            style={{
              animation: isSpinning
                ? "spinning82341 1.7s linear infinite"
                : "none",
            }}
          >
            <div className="spinner1-audio"></div>
          </div>
        </div>

        {/* audiostream */}
        <div
          style={{
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          className="content-container mt-10 lg:mt-6"
        >
          {audioStream ? (
            <AudioVisualizer audioStream={audioStream} />
          ) : (
            <WordSlider />
          )}
        </div>

        {/* Middle - Replay and Record Button */}
        <div className="flex justify-center space-x-4 mt-4 md:mt-0 mb-10">
          {/* Replay Button */}
          <div className="relative group">
            <button
              className="button rounded-full"
              onClick={playAudio}
              disabled={!audioChunks.length}
            >
              <div className={`${audioChunks.length ? "hoverEffect" : ""}`}>
                <div></div>
              </div>
              <Image
                src={replayImg}
                alt="replay"
                className="w-10 h-10 rounded-full z-10"
              />
            </button>
            <div
              role="tooltip"
              className={`absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100`}
              style={{
                bottom: "120%",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap", // Prevent text from wrapping to the next line
              }}
            >
              Replay
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>

          {/* Record Button */}
          <div className="relative group">
            <button
              className="button"
              onClick={toggleRecording}
              style={{ backgroundColor: isRecording ? "#f44336" : "" }}
            >
              {isRecording ? (
                <FontAwesomeIcon
                  icon={faPause}
                  style={{ color: "#ffffff" }}
                  className="w-9 h-9 z-10"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPlay}
                  style={{ color: "#ffffff" }}
                  className="w-9 h-9 z-10"
                />
              )}
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
            <div
              role="tooltip"
              className={`absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100`}
              style={{
                bottom: isRecording ? "120%" : "120%",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap", // Prevent text from wrapping to the next line
              }}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <button
              className={`button mb-20 w-40 flex flex-row justify-center ${
                audioChunks.length ? "" : "disabledButton"
              }`}
              onClick={uploadAudio}
              disabled={!audioChunks.length}
            >
              <FontAwesomeIcon
                icon={faArrowUpFromBracket}
                style={{ color: "#ffffff" }}
                className="w-7 h-7 z-10"
              />
              <div className={`${audioChunks.length ? "hoverEffect" : ""}`}>
                <div></div>
              </div>
              <span className="text-lg ms-2 py-3 z-10">Submit</span>
            </button>
            <div
              role="tooltip"
              className={`absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100`}
              style={{
                bottom: "120%",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap", // Prevent text from wrapping to the next line
              }}
            >
              Submit
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
