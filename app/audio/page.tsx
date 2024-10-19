import React from 'react';
import AudioRecorder from '@/components/AudioRecorder';

const AudioPage = () => {
    return (
        <div className="relative h-screen flex flex-col justify-center items-center text-white bg-[#0d0c22] overflow-hidden">
            <AudioRecorder />
        </div>
    );
};

export default AudioPage;
