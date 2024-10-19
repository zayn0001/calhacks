"use client"; // Mark this file as a Client Component

import React, { useState } from "react";

const About = () => {
  const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Full height of the viewport
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        justifyContent: "center",
        alignItems: "center",
        color: "white", // Text color for visibility
        textAlign: "center", // Center the text
        padding: "20px",
        backgroundColor: "#0d0c22",
      }}
    >
      <button onClick={() => setIsSpinning(!isSpinning)}>
        {isSpinning ? "Stop Spinner" : "Start Spinner"}
      </button>
      <div
        className="spinner"
        style={{
          marginTop: "20px",
          animation: isSpinning ? "spinning82341 1.7s linear infinite" : "none",
        }}
      >
        <div className="spinner1"></div>
      </div>
      <div className="flex gap-2">
        <button className="button">
          Record with audio!
          <div className="hoverEffect">
            <div></div>
          </div>
        </button>
        <button className="button">
          Record with camera!
          <div className="hoverEffect">
            <div></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default About;
