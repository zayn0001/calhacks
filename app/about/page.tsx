'use client'; // Mark this file as a Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import micImg from '@/public/mic.png';
import videoImg from '@/public/facetime.png';

const About = () => {
    const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

    return (
        <div className="bg-[#0d0c22] bg-cover bg-center h-screen flex flex-col justify-center items-center">
            <button onClick={() => setIsSpinning(!isSpinning)}>
                {isSpinning ? 'Stop Spinner' : 'Start Spinner'}
            </button>
            {/* Spinner */}
            <div
                className="spinner"
                style={{
                    marginTop: '20px',
                    animation: isSpinning ? 'spinning82341 1.7s linear infinite' : 'none',
                }}>
                <div className="spinner1"></div>
            </div>
            {/* Buttons: link to recording page */}
            <div className="flex gap-2 mt-9">
                <button className="button">
                    <Image src={micImg} alt="Microphone" />
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
                <button className="button">
                    <Image src={videoImg} alt="Video" className="w-20 h-20" />
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default About;
