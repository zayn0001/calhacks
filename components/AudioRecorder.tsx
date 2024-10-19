// 'use client';
// import { useRef, useState } from 'react';
// import Image from 'next/image';
// import replayImg from '@/public/replay.png';
// import AudioVisualizer from './AudioVisualizer';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faArrowUpFromBracket,
//     faPause,
//     faPlay,
//     faUpload,
// } from '@fortawesome/free-solid-svg-icons';

// const AudioRecorder = () => {
//     const audioRef = useRef<HTMLAudioElement>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//     const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

//     const [isRecording, setIsRecording] = useState(false); // state to control the recording process
//     const [isSpinning, setIsSpinning] = useState(false);

//     const startRecording = async () => {
//         setIsRecording(true);
//         setIsSpinning(true);

//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         setAudioStream(stream);
//         mediaRecorderRef.current = new MediaRecorder(stream);
//         mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
//             setAudioChunks((prev) => [...prev, event.data]);
//         });
//         mediaRecorderRef.current.start();
//     };

//     const stopRecording = () => {
//         mediaRecorderRef.current?.stop();
//         setIsRecording(false);
//         setIsSpinning(false);
//         setAudioStream(null);

//         // Cleanup media stream to prevent leaks
//         if (mediaRecorderRef.current?.stream) {
//             mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//         }
//     };

//     const toggleRecording = () => {
//         if (!isRecording) {
//             startRecording();
//         } else {
//             stopRecording();
//         }
//         setIsRecording(!isRecording);
//     };

//     const playAudio = () => {
//         if (audioChunks.length) {
//             const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             if (audioRef.current) {
//                 audioRef.current.src = audioUrl;
//                 audioRef.current.play();
//             }
//         }
//     };

//     const downloadAudio = () => {
//         const blob = new Blob(audioChunks, { type: 'audio/wav' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recorded-audio.wav';
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);
//         }, 100);
//     };

//     return (
//         <div>
//             {/* <audio ref={audioRef} controls /> */}

//             <div>
//                 {/* Spinner */}
//                 <div
//                     className="spinner-audio mt-5 flex flex-col justify-center"
//                     style={{
//                         animation: isSpinning
//                             ? 'spinning82341 1.7s linear infinite'
//                             : 'none',
//                     }}>
//                     <div className="spinner1-audio"></div>
//                 </div>
//                 <div style={{ minHeight: '200px' }} className="mt-10">
//                     {audioStream && <AudioVisualizer audioStream={audioStream} />}
//                 </div>

//                 {/* Middle - Replay and Record Button */}
//                 <div className="flex justify-center space-x-4 mt-4 mb-10">
//                     {/* Replay button */}
//                     <button
//                         className="button rounded-full"
//                         onClick={playAudio}
//                         disabled={!audioChunks.length}>
//                         <Image
//                             src={replayImg}
//                             alt="replay"
//                             className="w-10 h-10 rounded-full"
//                         />
//                         <div className="hoverEffect">
//                             <div></div>
//                         </div>
//                     </button>

//                     {/* Start/Stop button */}
//                     <button className="button" onClick={toggleRecording}>
//                         {isRecording ? (
//                             <FontAwesomeIcon
//                                 icon={faPause}
//                                 style={{ color: '#ffffff' }}
//                                 className="w-8 h-8"
//                             />
//                         ) : (
//                             <FontAwesomeIcon
//                                 icon={faPlay}
//                                 style={{ color: '#ffffff' }}
//                                 className="w-8 h-8"
//                             />
//                         )}
//                         <div className="hoverEffect">
//                             <div></div>
//                         </div>
//                     </button>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex flex-col items-center justify-center">
//                     <button
//                         className="button mb-20 w-40 flex flex-row justify-center"
//                         onClick={downloadAudio}
//                         disabled={!audioChunks.length}>
//                         <FontAwesomeIcon
//                             icon={faArrowUpFromBracket}
//                             style={{ color: '#ffffff' }}
//                             className="w-6 h-6"
//                         />
//                         <span className="ms-2 py-3">Submit</span>
//                         <div className="hoverEffect">
//                             <div></div>
//                         </div>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AudioRecorder;

'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import replayImg from '@/public/replay.png';
import AudioVisualizer from './AudioVisualizer';
import WordSlider from './WordSlider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpFromBracket,
    faPause,
    faPlay,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

    const [isRecording, setIsRecording] = useState(false);
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

    // const downloadAudio = () => {
    //     const blob = new Blob(audioChunks, { type: 'audio/wav' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'recorded-audio.wav';
    //     document.body.appendChild(a);
    //     a.click();
    //     setTimeout(() => {
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(url);
    //     }, 100);
    // };

    const uploadAudio = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', blob, 'recorded-audio.wav');

        fetch('/api/uploadaudio', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return (
        <div>
            <audio ref={audioRef} controls hidden />

            <div>
                {/* Spinner */}
                <div
                    className="spinner-audio mt-5 flex flex-col justify-center ms-1"
                    style={{
                        animation: isSpinning
                            ? 'spinning82341 1.7s linear infinite'
                            : 'none',
                    }}>
                    <div className="spinner1-audio"></div>
                </div>

                {/* audiostream */}
                <div
                    style={{
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                    className="mt-10">
                    {audioStream ? (
                        <AudioVisualizer audioStream={audioStream} />
                    ) : (
                        <WordSlider />
                        // <hr style={{ width: '100%', borderTop: '1px solid #ccc' }} />
                    )}
                </div>

                {/* Middle - Replay and Record Button */}
                <div className="flex justify-center space-x-4 mt-4 mb-10">
                    <button
                        className="button rounded-full"
                        onClick={playAudio}
                        disabled={!audioChunks.length}
                        // style={{
                        //     backgroundColor: audioChunks.length ? '' : '#333336',
                        //     zIndex: audioChunks.length ? '10' : '',
                        // }}>
                        style={{
                            backgroundColor: audioChunks.length ? 'purple' : '#333336',
                        }}>
                        {/* <div className="hoverEffect">
                            <div></div>
                        </div> */}
                        <Image
                            src={replayImg}
                            alt="replay"
                            className="w-10 h-10 rounded-full z-10"
                        />
                    </button>

                    <button
                        className="button"
                        onClick={toggleRecording}
                        // style={{ backgroundColor: isRecording ? '#f44336' : '' }}>
                        style={{ backgroundColor: isRecording ? '#f44336' : 'purple' }}>
                        {isRecording ? (
                            <FontAwesomeIcon
                                icon={faPause}
                                style={{ color: '#ffffff' }}
                                className="w-8 h-8 z-10"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faPlay}
                                style={{ color: '#ffffff' }}
                                className="w-8 h-8 z-10"
                            />
                        )}
                        {/* <div className="hoverEffect">
                            <div></div>
                        </div> */}
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center justify-center">
                    <button
                        className={`button mb-20 w-40 flex flex-row justify-center ${
                            audioChunks.length
                                ? 'enabledButton hoverEffect'
                                : 'disabledButton'
                        }`}
                        onClick={uploadAudio}
                        disabled={!audioChunks.length}>
                        <FontAwesomeIcon
                            icon={faArrowUpFromBracket}
                            style={{ color: '#ffffff' }}
                            className="w-6 h-6 z-10"
                        />
                        <span className="ms-2 py-3 z-10">Submit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioRecorder;

// 'use client';
// import { useRef, useState } from 'react';

// const AudioRecorder = () => {
//     const audioRef = useRef<HTMLAudioElement>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//     const [isRecording, setIsRecording] = useState(false);

//     const startRecording = async () => {
//         setIsRecording(true);
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorderRef.current = new MediaRecorder(stream);
//         mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
//             setAudioChunks((prev) => [...prev, event.data]);
//         });
//         mediaRecorderRef.current.start();
//     };

//     const stopRecording = () => {
//         mediaRecorderRef.current?.stop();
//         setIsRecording(false);
//         // Cleanup media stream to prevent leaks
//         if (mediaRecorderRef.current?.stream) {
//             mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//         }
//     };

//     const playAudio = () => {
//         if (audioChunks.length) {
//             const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             if (audioRef.current) {
//                 audioRef.current.src = audioUrl;
//                 audioRef.current.play();
//             }
//         }
//     };

//     const downloadAudio = () => {
//         const blob = new Blob(audioChunks, { type: 'audio/mp3' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recorded-audio.mp3';
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);
//         }, 100);
//     };

//     return (
//         <div>
//             <audio ref={audioRef} controls />
//             <div>
//                 <button
//                     className="button mt-16 mb-20"
//                     onClick={startRecording}
//                     disabled={isRecording}>
//                     Start Recording
//                     <div className="hoverEffect">
//                         <div></div>
//                     </div>
//                 </button>
//                 <button
//                     className="button mt-16 mb-20"
//                     onClick={stopRecording}
//                     disabled={!isRecording}>
//                     Stop Recording
//                     <div className="hoverEffect">
//                         <div></div>
//                     </div>
//                 </button>
//                 <button
//                     className="button mt-16 mb-20"
//                     onClick={playAudio}
//                     disabled={!audioChunks.length}>
//                     Replay Audio
//                     <div className="hoverEffect">
//                         <div></div>
//                     </div>
//                 </button>
//                 <button
//                     className="button mt-16 mb-20"
//                     onClick={downloadAudio}
//                     disabled={!audioChunks.length}>
//                     Save Audio
//                     <div className="hoverEffect">
//                         <div></div>
//                     </div>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AudioRecorder;
