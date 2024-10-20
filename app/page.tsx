import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import logoImg from "@/public/logo.png";

const Home = () => {
  const words = [
    {
      text: "Where",
    },
    {
      text: "Your",
    },
    {
      text: "Story",
    },
    {
      text: "Speaks",
    },
    {
      text: "for",
    },
    {
      text: "You.",
      className: "text-purple-500 dark:text-purple-500",
    },
  ];
  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-white bg-[#0d0c22]">
      <div className="bubbles"></div>
      {/* Responsive positioned buttons for login and signup */}
      <div className="absolute top-0 right-0 mt-4 mr-4 md:mt-6 md:mr-6 flex space-x-2 md:space-x-4">
        <button className="border text-xs md:text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-2 md:px-4 py-1 md:py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent  to-transparent h-px" />
        </button>
        <Link href="/signup">
          <button className="border text-xs md:text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-2 md:px-4 py-1 md:py-2 rounded-full">
            <span>Sign Up</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent to-transparent h-px" />
          </button>
        </Link>
      </div>
      {/* Centered content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <Image
          src={logoImg}
          alt="Logo"
          className="w-24 h-16 md:w-48 md:h-32 mb-2"
        />
        <div className="poppins-bold text-3xl md:text-5xl">Recall AI</div>
        {/* Typewriter Effect -- Slogan */}
        <div className="flex justify-center items-center w-full">
          <TypewriterEffectSmooth words={words} />
        </div>
      </div>
      {/* Responsive button position */}
      <div className="w-full px-4 py-2 absolute bottom-24 md:bottom-44 left-0 flex items-center justify-center md:relative md:flex md:flex-col md:items-center md:justify-center h-20">
        <Link href="/home" className="poppins-regular">
          <button className="button">
            <span className="py-2 px-4">GET STARTED</span>
            <div className="hoverEffect">
              <div></div>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
