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

  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  ); // State to hold both user and incoming messages
  const [showCards, setShowCards] = useState(true); // State to control card visibility

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // Handle input change
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements[0] as HTMLInputElement; // Explicitly cast to HTMLInputElement
    const inputValue = input.value; // Get the value from the input
    if (inputValue) {
      // Add the user's message to the list
      setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
      console.log("Input submitted!", inputValue); // Handle form submission
      e.currentTarget.reset(); // Clear the input after submission
      setShowCards(false); // Hide the cards when input is submitted

      // Simulate a system response after a short delay
      setTimeout(() => {
        simulateIncomingMessage("This is a system response to: " + inputValue);
      }, 1000); // Adjust the timeout as needed
    }
  };

  // Simulate incoming messages from another source
  const simulateIncomingMessage = (message: string) => {
    setMessages((prev) => [...prev, { text: message, sender: "system" }]); // Add the incoming message to the list
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
    {
      title: "Discomfort Check",
      description: "Did the patient feel any discomfort today?",
    },
  ];

  // Function to handle card click and update submitted messages
  const handleCardClick = (description: string) => {
    setMessages((prev) => [...prev, { text: description, sender: "user" }]); // Add the clicked question to the list
    setShowCards(false); // Hide the cards after one is clicked
    console.log("Card clicked!", description); // Handle card click

    // Simulate a system response for the clicked question
    setTimeout(() => {
      simulateIncomingMessage("Response to: " + description);
    }, 1000); // Adjust the timeout as needed
  };

  return (
    <div className="flex flex-col bg-[#0d0c22] text-white h-screen p-4 rounded-lg shadow-lg overflow-hidden">
      <div className="bubbles"></div>
      <div className="flex-1 overflow-auto mb-4">
        {/* Render messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg transition-transform transform shadow-md ${
              msg.sender === "user"
                ? "bg-gray-500 self-start max-w-xs"
                : "bg-blue-500 self-end max-w-xs ml-auto"
            }`}
          >
            <p className="text-lg text-white">{msg.text}</p>
            <p className="text-sm text-gray-200">
              {msg.sender === "user" ? "Submitted" : "Received"} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex justify-center items-center p-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleInputSubmit}
        />
      </div>

      {/* Prefill Questions Area */}
      {showCards && (
        <div className="mb-4">
          <HoverEffect items={questions} onCardClick={handleCardClick} />
        </div>
      )}
    </div>
  );
};

export default Page;
