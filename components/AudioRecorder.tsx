'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import replayImg from '@/public/replay.png';
import AudioVisualizer from './AudioVisualizer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCirclePlay, faPlay } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

    const [isRecording, setIsRecording] = useState(false); // state to control the recording process
    const [isSpinning, setIsSpinning] = useState(false);

    const startRecording = async () => {
        setIsRecording(true);
        setIsSpinning(true);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
            setAudioChunks((prev) => [...prev, event.data]);
        });
        mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        setIsSpinning(false);
        setAudioStream(null);

        // Cleanup media stream to prevent leaks
        if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
    };

    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
        setIsRecording(!isRecording);
    };

    const playAudio = () => {
        if (audioChunks.length) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        }
    };

    const downloadAudio = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recorded-audio.wav';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <div>
            <audio ref={audioRef} controls />
            {audioStream && <AudioVisualizer audioStream={audioStream} />}

            <div>
                {/* Spinner */}
                <div
                    className="spinner mt-5 flex flex-col justify-center"
                    style={{
                        animation: isSpinning
                            ? 'spinning82341 1.7s linear infinite'
                            : 'none',
                    }}>
                    <div className="spinner1"></div>
                </div>
                {/* Start/Stop buttons */}
                <button className="button mt-16 mb-20" onClick={toggleRecording}>
                    <FontAwesomeIcon
                        icon={faPlay}
                        style={{ color: '#ffffff' }}
                        className="w-6 h-6 mr-2"
                    />
                    {isRecording ? 'Stop' : 'Start'}
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
                {/* Replay button */}
                <button
                    className="button mt-16 mb-20"
                    onClick={playAudio}
                    disabled={!audioChunks.length}>
                    <Image src={replayImg} alt="replay" className="w-6 h-6 mr-2" />
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{ color: '#ffffff' }}
                        className="w-6 h-6 mr-2"
                    />
                    Replay
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
                {/* Download Button */}
                <button
                    className="button mt-16 mb-20"
                    onClick={downloadAudio}
                    disabled={!audioChunks.length}>
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{ color: '#ffffff' }}
                        className="w-6 h-6 mr-2"
                    />
                    Save
                    <div className="hoverEffect">
                        <div></div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default AudioRecorder;
