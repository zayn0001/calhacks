"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import Link from "next/link";
import micImg from "@/public/mic.png";
import videoImg from "@/public/facetime.png";
import trainImg from "@/public/train.png";
import searchImg from "@/public/search.png";

import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/moving-border";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const words = `Hi, Mirlan!`;
  const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

  return (
    <div className="bg-[#0d0c22] bg-cover bg-center h-screen flex flex-col justify-center items-center text-white">
      <div className="bubbles"></div>
      {/* Button positioned in the top right corner */}
      <a className="absolute top-4 left-4 ml-2 mt-3" href="/">
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ color: "#fffff3" }}
          className="w-6 h-6 mr-2"
        />
      </a>
      <div className="absolute top-4 right-4">
        <Link href="/check">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 transition-opacity duration-200 ease-in-out hover:opacity-80"
          >
            Check patient
          </Button>
        </Link>
      </div>

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

      {/* Buttons with flex layout */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-9 w-full max-w-md">
        {/* Audio Button */}
        <div className="relative group flex-grow">
          <Link href="/audio" className="poppins-regular">
            <button className="button flex items-center w-full justify-center">
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
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            Record your day!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

        {/* Video Button */}
        <div className="relative group flex-grow">
          <Link href="/video" className="poppins-regular">
            <button className="button flex items-center w-full justify-center">
              <Image
                src={videoImg}
                alt="Video"
                className="w-12 h-12 object-cover"
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
              whiteSpace: "nowrap",
            }}
          >
            Capture a moment!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

        {/* Ask Button */}
        <div className="relative group flex-grow">
          <Link href="/responder" className="poppins-regular">
            <button className="button flex items-center w-full justify-center">
              <Image
                src={searchImg}
                alt="Ask"
                className="w-8 h-8 mr-2 object-cover"
                style={{ objectPosition: "center" }}
              />
              <span className="py-3 mr-5">ASK</span>
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
              whiteSpace: "nowrap",
            }}
          >
            Ask a question!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

        {/* Train Button */}
        <div className="relative group flex-grow">
          <Link href="/train" className="poppins-regular">
            <button className="button flex items-center w-full justify-center">
              <Image
                src={trainImg}
                alt="Train"
                className="w-7 h-7 mr-1 object-cover"
                style={{ objectPosition: "center" }}
              />
              <span className="py-3 mr-6">TRAIN</span>
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
              whiteSpace: "nowrap",
            }}
          >
            Replicate your voice!
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
