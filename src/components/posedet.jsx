import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export default function PoseDetection() {

    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const streamRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const canvasRef = useRef(null);


    async function CreatePoseLandmarker() {
        if (poseLandmarkerRef.current) {
            return;
        }
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
                },

                runningMode: "VIDEO",

                numPoses: 1
            }
        );
    }
    function drawpose(landmarks) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(
            0, 0, canvas.width, canvas.height
        );

        for (const landmark of landmarks) {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            ctx.beginPath();
            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        // const nose = results.landmarks[0][0];
        // const x = nose.x * canvas.width;
        // const y = nose.y * canvas.height;

        // ctx.beginPath();
        // ctx.arc(
        //     x, y, 5, 0, Math.PI * 2
        // );
        // ctx.fill();
    }
    function detectpose() {
        if (!poseLandmarkerRef.current) return;
        if (videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            requestAnimationFrame(detectpose);
            return;
        }
        const results = poseLandmarkerRef.current.detectForVideo(
            videoRef.current, performance.now()
        );
        if (results.landmarks.length > 0) {

            console.log(results.landmarks[0]);
            drawpose(results.landmarks[0]) //ye [0] one person ko dikha rha hai

        }

        requestAnimationFrame(detectpose);

    }
    async function startCamera() {
        await CreatePoseLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        streamRef.current = stream;

        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
            detectpose();
        }

        setIsCameraOn(true);

    }
    async function stopCamera() {
        if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); }

        videoRef.current.srcObject = null;

        setIsCameraOn(false);

    }

    return (
        <div className="pose-detection-container">
            <button
                className={`pose-det-btn ${isCameraOn ? "active" : ""}`}
                onClick={isCameraOn ? stopCamera : startCamera}
            >
                📹 {isCameraOn ? "Stop Camera" : "Start Camera"}
            </button>

            <div className={`pose-video-wrapper ${isCameraOn ? "visible" : ""}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="pose-video-feed"
                />
                <canvas
                    ref={canvasRef}
                    className="pose-canvas" />
                <div className="pose-video-overlay-glow"></div>
            </div>
        </div>
    );
}