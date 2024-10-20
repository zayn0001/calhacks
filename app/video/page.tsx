"use client"; // Mark this file as a Client Component

import React, { useState, useRef, useEffect } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import VideoPlayer from "@/components/ui/VideoPlayer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const RecordPage = () => {
  // State to keep track of the latest text
  const [latestText, setLatestText] = useState<string>(
    
  );

  // Create a ref for the transcript box
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Function to add new text
  const addNewText = (newText: string) => {
    setLatestText(newText); // Update latest text with new input
  };

  // Effect to auto-scroll to the bottom of the transcript box when latestText changes
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [latestText]);

  return (
    <div className="h-screen flex flex-col bg-[#0d0c22] text-white relative overflow-hidden">
      {/* Floating bubble effect */}
      <Link
        href="/home"
        className="absolute top-5 left-5 m-4 flex items-center cursor-pointer"
        style={{zIndex:100}}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ color: "#ffffff" }}
          className="w-6 h-6 mr-2"
        />
      </Link>
      <div className="bubbles"></div>
      

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center z-10">
        {/* Video communication box with gradient background */}
        <BackgroundGradient className="w-full max-w-lg mx-auto" animate={true}>
          <div
            style={{ borderRadius: "1.75rem" }}
            className="bg-white dark:bg-slate-900 text-black dark:text-white p-3 shadow-2xl rounded-3xl border border-neutral-200 dark:border-slate-700 relative"
          >
            {/* Placeholder for the video feed */}
            <VideoPlayer setNewDescription={addNewText} />
          </div>
        </BackgroundGradient>

        {/* Transcript box with scroll */}
        <h1 className="text-2xl font-bold mt-5 text-center">
          Recent Transcript
        </h1>
        <div
          ref={transcriptRef} // Attach the ref here
          className="mt-4 w-full max-w-lg overflow-auto h-40 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md"
        >
          <TextGenerateEffect words={latestText || ""} className="px-4" />
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
