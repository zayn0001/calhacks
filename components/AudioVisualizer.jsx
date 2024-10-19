import { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioStream }) => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef();

    useEffect(() => {
        // Visualizing audio with Web Audio API
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(audioStream);
        source.connect(analyser);
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        // animating the visualization
        // bar style
        const draw = () => {
            animationFrameId.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.fillStyle = '#0d0c22';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                canvasCtx.fillStyle = `rgb(${barHeight + 100}, 30, ${barHeight + 100})`;
                canvasCtx.fillRect(
                    x,
                    canvas.height - barHeight / 2,
                    barWidth,
                    barHeight / 2
                );
                x += barWidth + 1;
            }
        };
        // gradient
        // const draw = () => {
        //     animationFrameId.current = requestAnimationFrame(draw);
        //     analyser.getByteFrequencyData(dataArray);

        //     canvasCtx.fillStyle = '#0d0c22';
        //     canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        //     const barWidth = (canvas.width / bufferLength) * 2.5;
        //     let x = 0;

        //     for (let i = 0; i < bufferLength; i++) {
        //         const barHeight = dataArray[i];
        //         const gradient = canvasCtx.createLinearGradient(
        //             x,
        //             canvas.height - barHeight,
        //             x,
        //             canvas.height
        //         );
        //         gradient.addColorStop(0, 'rgb(137, 207, 240)');
        //         gradient.addColorStop(
        //             1,
        //             `rgb(${barHeight + 100}, 30, ${barHeight + 100})`
        //         );

        //         canvasCtx.fillStyle = gradient;
        //         canvasCtx.fillRect(
        //             x,
        //             canvas.height - barHeight / 2,
        //             barWidth,
        //             barHeight / 2
        //         );

        //         x += barWidth + 1;
        //     }
        // };
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            audioCtx.close();
        };
    }, [audioStream]);

    return (
        <canvas
            ref={canvasRef}
            width="640"
            height="100"
            style={{ width: '100%' }}></canvas>
    );
};

export default AudioVisualizer;
