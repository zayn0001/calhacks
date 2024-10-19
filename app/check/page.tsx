"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const Page = () => {
  const placeholders = [
    "Type your message...",
    "What are you thinking?",
    "Share your thoughts...",
  ];

  const [submittedMessages, setSubmittedMessages] = useState<string[]>([]); // State to hold submitted messages

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // Handle input change
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements[0] as HTMLInputElement; // Explicitly cast to HTMLInputElement
    const inputValue = input.value; // Get the value from the input
    if (inputValue) {
      setSubmittedMessages((prev) => [...prev, inputValue]); // Add the submitted message to the list
      console.log("Input submitted!", inputValue); // Handle form submission
      e.currentTarget.reset(); // Clear the input after submission
    }
  };

  // Prefilled questions relevant to dementia care
  const questions = [
    {
      title: "Daily Summary",
      description: "Write a summary of what the patient did today.",
    },
    {
      title: "Medication Adherence",
      description:
        "Did the patient take their medication every day for the past week?",
    },
    {
      title: "Social Interaction",
      description: "How often did the patient interact with others today?",
    },
    {
      title: "Mood Assessment",
      description: "What was the patient's mood throughout the day?",
    },
    {
      title: "Routine Changes",
      description: "Were there any changes to the patient's routine today?",
    },
  ];

  // Function to handle card click and update submitted messages
  const handleCardClick = (description: string) => {
    setSubmittedMessages((prev) => [...prev, description]); // Add the clicked question to the list
    console.log("Card clicked!", description); // Handle card click
  };

  return (
    <div className="flex flex-col bg-[#0d0c22] text-white h-screen p-4 rounded-lg shadow-lg">
      <div className="bubbles"></div>
      <div className="flex-1 overflow-auto mb-4">
        {submittedMessages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-800 rounded-lg">
            <p>{msg}</p>
          </div>
        ))}
      </div>

      {/* Prefill Questions Area */}
      <div className="mb-4">
        <HoverEffect items={questions} onCardClick={handleCardClick} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleInputSubmit}
        />
      </div>
    </div>
  );
};

export default Page;
