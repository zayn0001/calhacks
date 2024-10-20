"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import replayImg from "@/public/replay.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const AudioTrainer = () => {
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
        setAudioChunks((prev) => [event.data]); // Append new audio chunk
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
    mediaRecorderRef.current?.stream
      ?.getTracks()
      .forEach((track) => track.stop());
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
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

  const replayAudio = () => {
    playAudio(); // Reuse playAudio for replay functionality
  };

  const deleteAudio = () => {
    setAudioChunks([]); // Clear the audio chunks
    if (audioRef.current) {
      audioRef.current.src = ""; // Clear the audio source
    }
  };

  const uploadAudio = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", blob, "recorded-audio.wav");
    formData.append("name", "newvoice")

    fetch("/api/create_voice", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      window.location.href="/home"
  };

  return (
    <div className="bg-[#0d0c22] bg-cover h-screen flex flex-col items-center text-white pt-8 md:pt-10 px-4 md:px-0">
      <div className="bubbles"></div>
      <div className="absolute top-5 left-5 m-4">
        <a className="flex items-center" href="/home">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ color: "#ffffff" }}
            className="w-6 h-6 mr-2"
          />
        </a>
      </div>
      <audio ref={audioRef} controls hidden />
      <BackgroundGradient
        className="w-full max-w-xl mx-auto flex items-center justify-center"
        animate={true}
      >
        <div className="bg-gray-800 p-4 md:p-6 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 md:mb-4">
            Audio Trainer
          </h1>
          <p className="text-base md:text-xl text-gray-300 text-center">
            Welcome to our Audio Trainer! This platform is designed to help you
            enhance your voice training experience to build a personalized voice
            model that accurately replicates your unique sound. To achieve the
            best results, we encourage you to speak naturally and clearly. Use
            varied tones, pitch, and pace as you read the provided prompts or
            engage in spontaneous speech. As you record, take your time to
            articulate your words and express yourself freely, just as you would
            in a conversation. Feel free to replay your recordings to analyze
            your performance and track your progress. Once you’re satisfied with
            your recordings, submitting them is easy!
          </p>
        </div>
      </BackgroundGradient>

      {/* Middle - Replay and Record Button */}
      <div className="flex justify-center space-x-8 mt-4">
        {/* Replay Button */}
        <div className="relative group mt-4">
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
              className="w-8 h-8 md:w-10 md:h-10 rounded-full z-10"
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
        <div className="relative group mt-4">
          <button
            className="button"
            onClick={toggleRecording}
            style={{ backgroundColor: isRecording ? "#f44336" : "" }}
          >
            {isRecording ? (
              <FontAwesomeIcon
                icon={faPause}
                style={{ color: "#ffffff" }}
                className="w-7 h-7 md:w-9 md:h-9 z-10"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlay}
                style={{ color: "#ffffff" }}
                className="w-7 h-7 md:w-9 md:h-9 z-10"
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
        <div className="relative group mt-4">
          <button
            className={`button w-32 md:w-40 flex flex-row justify-center ${
              audioChunks.length ? "" : "disabledButton"
            }`}
            onClick={uploadAudio}
            disabled={!audioChunks.length}
          >
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              style={{ color: "#ffffff" }}
              className="w-6 h-6 md:w-7 md:h-7 z-10"
            />
            <div className={`${audioChunks.length ? "hoverEffect" : ""}`}>
              <div></div>
            </div>
            <span className="text-base md:text-lg ms-2 py-3 z-10">Submit</span>
          </button>
          <div
            role="tooltip"
            className={`absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100`}
            style={{
              bottom: "120%",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            Submit
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTrainer;
