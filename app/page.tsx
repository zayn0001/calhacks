import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

const Home = () => {
    const words = [
        {
            text: 'The',
        },
        {
            text: 'future',
        },
        {
            text: 'of',
        },
        {
            text: 'Conversational',
        },
        {
            text: 'Memory.',
            className: 'text-purple-500 dark:text-purple-500',
        },
    ];

    return (
        <div className="relative h-screen flex flex-col justify-center items-center text-white bg-[#0d0c22] overflow-hidden">
            <div className="bubbles"></div>
            <div className="flex justify-center items-center w-full">
                <TypewriterEffectSmooth words={words} />
            </div>
            <Link href="/home" className="poppins-regular">
                <button className="button mt-16 mb-20">
                    GET STARTED
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
            </Link>
        </div>
    );
};

export default Home;
