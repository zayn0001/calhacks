import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

const Home = () => {
    return (
        <div className="relative h-screen flex flex-col items-center text-white bg-[#0d0c22] overflow-hidden">
            {/* Bubble Background */}
            <div className="bubbles"></div>
            {/* Sliding Words */}
            <div className="wrapper mt-8">
                <span className="letter letter1">R</span>
                <span className="letter letter2">E</span>
                <span className="letter letter3">C</span>
                <span className="letter letter4">A</span>
                <span className="letter letter5">P</span>
            </div>
            {/* Spacer to push button to the bottom */}
            <div className="flex-grow"></div>

            <Link href="/home" className="poppins-regular">
                <button className="button mb-20">
                    {' '}
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
