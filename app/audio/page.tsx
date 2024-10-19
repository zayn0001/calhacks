import React from 'react';
import Link from 'next/link';
import AudioRecorder from '@/components/AudioRecorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AudioPage = () => {
    return (
        <div className="relative h-screen flex flex-col justify-center items-center text-white bg-[#0d0c22] overflow-hidden">
            {/* Button: Back */}
            <Link href="/home">
                <div className="absolute top-5 left-5 m-4">
                    <a className="flex items-center">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ color: '#ffffff' }}
                            className="w-6 h-6 mr-2"
                        />
                    </a>
                </div>
            </Link>
            {/* Main content */}
            <AudioRecorder />
        </div>
    );
};

export default AudioPage;
