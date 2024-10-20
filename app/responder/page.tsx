'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Vapi from "@vapi-ai/web";
import replayImg from '@/public/replay.png';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SyncLoader } from 'react-spinners';

const AudioPage = () => {
    const vapi = new Vapi("59c6864c-443e-4486-a0a6-149819d0c734");

    useEffect(()=>{

        vapi.start("2ff538ce-29cb-4f73-af80-495559c5865c");
        vapi.say("Hey swapnil, how can i help you?", false)
        vapi.on("speech-end", () => {
            vapi.stop()
            vapi.start("2ff538ce-29cb-4f73-af80-495559c5865c")
        })
    }, [])
    return (
        <div className="relative h-screen flex flex-col justify-center items-center text-white bg-[#0d0c22] overflow-hidden">
            {/* Button: Back */}
            <div className="absolute top-5 left-5 m-4">
                <a className="flex items-center" href='/home'>
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        style={{ color: '#ffffff' }}
                        className="w-6 h-6 mr-2"
                    />
                </a>
            </div>
            <SyncLoader color="#BA42FF"></SyncLoader>
            <button
                        className={`button w-40 mt-[200px]`}
                        onClick={()=>{vapi.stop();window.location.href="/home"}}>
                        
                        <div className={'hoverEffect'}>
                            <div></div>
                        </div>
                        <span className="text-lg ms-2 py-3 z-10">End Conversation</span>
                    </button>
            {/* Main content */}
        </div>
        
    );
};

export default AudioPage;
