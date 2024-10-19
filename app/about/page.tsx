"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import micImg from "@/public/mic.png";
import videoImg from "@/public/facetime.png";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { FloatingNav } from "@/components/ui/floating-navbar";
const About = () => {
  const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

  const handleRecording = async () => {
    console.log("clicked recording");
  };

  return (
    <div className="bg-[#0d0c22] bg-cover bg-center h-screen flex flex-col justify-center items-center text-white">
      <div className="bubbles"></div>
      <FloatingNav navItems={navItems} className="z-[1000]" />

      {/* Welcome text */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-extrabold text-gray-200 tracking-wide">
          Hello, Mirlan!
        </h1>
        <p className="text-xl text-gray-400 mt-2 leading-snug">
          I can help you <FlipWords words={["store", "recall"]} duration={3000} />your memories for today.
        </p>
      </div>

      {/* Spinner toggle button */}
      {/* <button
        onClick={() => setIsSpinning(!isSpinning)}
        className="px-4 py-2 rounded"
      >
        {isSpinning ? "Stop Spinner" : "Start Spinner"}
      </button> */}

      {/* Spinner */}
      <div
        className="spinner mt-5"
        style={{
          animation: isSpinning ? "spinning82341 1.7s linear infinite" : "none",
        }}
      >
        <div className="spinner1"></div>
      </div>

      {/* Audio and Video buttons */}
      <div className="flex gap-6 mt-9">
        <button className="button" onClick={handleRecording}>
          <Image src={micImg} alt="Microphone" className="w-5 h-6 mr-2" />
          audio
          <div className="hoverEffect">
            <div></div>
          </div>
        </button>
        <button className="button">
          <Image src={videoImg} alt="Video" className="w-12 h-12" />
          camera
          <div className="hoverEffect">
            <div></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default About;
