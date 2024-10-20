"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import Link from "next/link";
import micImg from "@/public/mic.png";
import videoImg from "@/public/facetime.png";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Home = () => {
  const words = `Hi, Mirlan!`;
  const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

  return (
    <div className="bg-[#0d0c22] bg-cover bg-center h-screen flex flex-col justify-center items-center text-white">
      <div className="bubbles"></div>

      {/* Welcome text */}
      <div className="text-center mb-10">
        <TextGenerateEffect
          duration={2}
          filter={false}
          words={words}
          className="mb-5"
        />
        <p className="text-xl text-gray-400 mt-2 leading-snug">
          I can help you {""}
          <FlipWords words={["store", "recap", "retrieve"]} duration={2500} />
          your memories
        </p>
      </div>

      <div
        className="spinner my-5"
        style={{
          animation: "spinning82341 1.7s linear infinite",
        }}
      >
        <div className="spinner1"></div>
      </div>

      {/* Audio and Video buttons with tooltips */}
      <div className="flex gap-6 mt-9 relative">
        <div className="relative group">
          <Link href="/audio" className="poppins-regular">
            <button className="button">
              <Image src={micImg} alt="Microphone" className="w-5 h-6 mx-4" />
              <span className="py-3 mr-4">AUDIO</span>
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
          </Link>
          <div
            role="tooltip"
            className="absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100"
            style={{
              bottom: "-70%",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap", // Prevent text from wrapping to the next line
            }}
          >
            Record your day!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

        <div className="relative group">
          <Link href="/video" className="poppins-regular">
            <button className="button">
              <Image
                src={videoImg}
                alt="Video"
                className="w-12 h-12 mr-2 object-cover"
                style={{ objectPosition: "center" }}
              />
              <span className="py-3 mr-5">VIDEO</span>
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
          </Link>
          <div
            role="tooltip"
            className="absolute z-10 invisible inline-block max-w-xs px-3 py-2 text-sm font-medium text-white bg-white/30 backdrop-blur-lg rounded-lg shadow-lg opacity-0 tooltip dark:bg-gray-900/40 group-hover:visible group-hover:opacity-100"
            style={{
              bottom: "-70%",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap", // Prevent text from wrapping to the next line
            }}
          >
            Capture a moment!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
