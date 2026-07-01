import { useEffect, useRef, useState } from "react";

export default function PoseDetection() {

    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const streamRef = useRef(null);

    async function startCamera() {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        streamRef.current = stream;

        videoRef.current.srcObject = stream;

        setIsCameraOn(true);
    }
    async function stopCamera() {
        streamRef.current.getTracks().forEach(track => track.stop());

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