// import { useEffect, useRef } from 'react';

import { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioStream }) => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        if (audioStream) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(audioStream);
            source.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                animationFrameId.current = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);

                canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
                canvasCtx.fillStyle = '#0d0c22';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2; // Half height for symmetry around center
                    const yCenter = canvas.height / 2; // Center y position

                    // Draw upper half
                    canvasCtx.fillStyle = `rgb(${barHeight * 2 + 100}, 30, ${
                        barHeight * 2 + 100
                    })`;
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(x, yCenter);
                    canvasCtx.arcTo(
                        x + barWidth,
                        yCenter,
                        x + barWidth,
                        yCenter - barHeight,
                        barWidth / 2
                    );
                    canvasCtx.arcTo(
                        x + barWidth,
                        yCenter - barHeight,
                        x,
                        yCenter - barHeight,
                        barWidth / 2
                    );
                    canvasCtx.arcTo(x, yCenter - barHeight, x, yCenter, barWidth / 2);
                    canvasCtx.arcTo(x, yCenter, x + barWidth, yCenter, barWidth / 2);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    // Draw lower half
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(x, yCenter);
                    canvasCtx.arcTo(
                        x + barWidth,
                        yCenter,
                        x + barWidth,
                        yCenter + barHeight,
                        barWidth / 2
                    );
                    canvasCtx.arcTo(
                        x + barWidth,
                        yCenter + barHeight,
                        x,
                        yCenter + barHeight,
                        barWidth / 2
                    );
                    canvasCtx.arcTo(x, yCenter + barHeight, x, yCenter, barWidth / 2);
                    canvasCtx.arcTo(x, yCenter, x + barWidth, yCenter, barWidth / 2);
                    canvasCtx.closePath();
                    canvasCtx.fill();

                    x += barWidth + 1;
                }
            };
            draw();

            return () => {
                cancelAnimationFrame(animationFrameId.current);
                audioCtx.close();
            };
        }
    }, [audioStream]);

    return <canvas ref={canvasRef} className="w-full h-full md:w-1/2 lg:w-1/3"></canvas>;
};

export default AudioVisualizer;
