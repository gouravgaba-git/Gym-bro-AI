import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

export default function PoseDetection() {

    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const streamRef = useRef(null);
    const poseLandmarkerRef = useRef(null);

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
                <div className="pose-video-overlay-glow"></div>
            </div>
        </div>
    );
}