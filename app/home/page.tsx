'use client'; // Mark this file as a Client Component

import React, { useState } from 'react';
import micImg from '@/public/mic.png';
import videoImg from '@/public/facetime.png';
import Image from 'next/image';

const About = () => {
    const [isSpinning, setIsSpinning] = useState(false); // State to control spinner

    const handleRecording = async () => {
        console.log('clicked recording');
    };

    return (
        <div className="bg-[#0d0c22] bg-cover bg-center h-screen flex flex-col justify-center items-center">
            <button onClick={() => setIsSpinning(!isSpinning)}>
                {isSpinning ? 'Stop Spinner' : 'Start Spinner'}
            </button>

            <div
                className="spinner"
                style={{
                    marginTop: '20px',
                    animation: isSpinning ? 'spinning82341 1.7s linear infinite' : 'none',
                }}>
                <div className="spinner1"></div>
            </div>
            <div className="flex gap-2 mt-9">
                <button className="button" onClick={handleRecording}>
                    <Image src={micImg} alt="Microphone" className="w-5 h-6 mr-2" />
                    audio
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
                <button className="button">
                    <Image src={videoImg} alt="Video" className="w-12 h-12" />
                    camera
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default About;
