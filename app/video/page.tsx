"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import VideoPlayer from "@/components/ui/VideoPlayer";

const RecordPage = () => {
  // State to keep track of text boxes (string array)
  const [texts, setTexts] = useState<string[]>([]);

  // Counter to track the next index to replace after 3 texts
  const [replaceIndex, setReplaceIndex] = useState(0);

  // Function to add new text and limit it to 3 items, then replace items in a circular manner
  const addNewText = (newText: string) => {
    setTexts((prevTexts) => {
      if (prevTexts.length < 3) {
        // If fewer than 3 texts, just add new text normally
        return [...prevTexts, newText];
      } else {
        // Replace text in a circular manner after 3 items
        const updatedTexts = [...prevTexts];
        updatedTexts[replaceIndex] = newText;
        // Update the replaceIndex to cycle through 0, 1, 2
        setReplaceIndex((prevIndex) => (prevIndex + 1) % 3);
        return updatedTexts;
      }
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0c22] text-white relative overflow-hidden">
      {/* Floating bubble effect */}
      <div className="bubbles absolute inset-0 pointer-events-none z-0"></div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center z-10">
        {/* Video communication box with gradient background */}
        <BackgroundGradient className="w-full max-w-lg mx-auto" animate={true}>
          <div
            style={{ borderRadius: "1.75rem" }}
            className="bg-white dark:bg-slate-900 text-black dark:text-white p-3 shadow-2xl rounded-xl border border-neutral-200 dark:border-slate-700 relative"
          >
            {/* Placeholder for the video feed */}
            <VideoPlayer setNewDescription={addNewText} />
          </div>
        </BackgroundGradient>

        {/* Generated text below the video box */}
        <h1 className="text-2xl font-bold mt-8 text-center">Generated Text</h1>
        <div className="mx-4">
          {texts.map((text, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mt-2 w-full max-w-3xl text-center shadow-lg"
            >
              {text}
            </div>
          ))}
        </div>

        {/* Button to add new text */}
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() =>
            addNewText(`This is a newly generated ${replaceIndex.toString()} text`)
          }
        >
          Generate New Text
        </button>
      </div>
    </div>
  );
};

export default RecordPage;
