"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const RecordPage = () => {
  // State to keep track of text boxes
  const [texts, setTexts] = useState(["This is the first text box."]);

  // Counter to track the next index to replace after 3 texts
  const [replaceIndex, setReplaceIndex] = useState(0);

  // Function to add new text and limit it to 3 items, then replace items in a circular manner
  const addNewText = (newText: any) => {
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

      <div className="flex flex-col items-center">
        <div className="flex space-x-4">
          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            <span>Sign Up</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center z-10">
        {/* Video communication box with gradient background */}
        <BackgroundGradient className="w-full max-w-lg mx-auto" animate={true}>
          <div
            style={{ borderRadius: "1.75rem" }}
            className="bg-white dark:bg-slate-900 text-black dark:text-white p-3 shadow-2xl rounded-xl border border-neutral-200 dark:border-slate-700 relative"
          >
            {/* Placeholder for the video feed */}
            <div className="w-full h-64 bg-gradient-to-r from-gray-300 to-gray-400 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
              <p className="text-lg text-center font-semibold tracking-wide text-gray-600 dark:text-gray-300 m-3">
                Video feed will appear here
              </p>
            </div>
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
              <TextGenerateEffect
                words={text}
                className="text-md leading-relaxed text-white"
              />
            </div>
          ))}
        </div>

        {/* Button to add new text */}
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => addNewText("This is a newly generated text")}
        >
          Generate New Text
        </button>
      </div>
    </div>
  );
};

export default RecordPage;
