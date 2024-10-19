// 'use client';
// import { useRef, useState } from 'react';

// const VideoRecorder = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

//     const startCamera = async () => {
//         const constraints = { video: true, audio: true };
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia(constraints);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//             }
//             mediaRecorderRef.current = new MediaRecorder(stream, {
//                 mimeType: 'video/webm',
//             });
//             mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//                 if (event.data.size > 0) {
//                     setRecordedChunks((prev) => [...prev, event.data]);
//                 }
//             };
//         } catch (error) {
//             console.error('Error accessing media devices:', error);
//         }
//     };

//     const startRecording = () => {
//         startCamera();
//         mediaRecorderRef.current?.start();
//         console.log('MediaRecorder started', mediaRecorderRef.current);
//     };

//     const pauseRecording = () => {
//         mediaRecorderRef.current?.pause();
//     };

//     const resumeRecording = () => {
//         mediaRecorderRef.current?.resume();
//     };

//     const stopRecording = () => {
//         mediaRecorderRef.current?.stop();
//     };

//     const downloadVideo = () => {
//         const blob = new Blob(recordedChunks, { type: 'video/webm' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recorded-video.webm';
//         document.body.appendChild(a);
//         a.click();
//         URL.revokeObjectURL(url);
//         setTimeout(() => {
//             document.body.removeChild(a);
//         }, 100);
//     };

//     return (
//         <div>
//             <video ref={videoRef} controls style={{ width: '100%', maxWidth: '600px' }} />
//             <div>
//                 <button onClick={startRecording}>Start Recording</button>
//                 <button onClick={pauseRecording}>Pause Recording</button>
//                 <button onClick={resumeRecording}>Resume Recording</button>
//                 <button onClick={stopRecording}>Stop Recording</button>
//                 <button onClick={downloadVideo}>Download Video</button>
//             </div>
//         </div>
//     );
// };

// export default VideoRecorder;
