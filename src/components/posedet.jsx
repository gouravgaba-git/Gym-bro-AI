import { useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
function calculateAngle(A, B, C) {

    let radians =
        Math.atan2(
            C.y - B.y,
            C.x - B.x
        ) -
        Math.atan2(
            A.y - B.y,
            A.x - B.x
        );

    let angle =
        Math.abs(radians * 180.0 / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}

export default function PoseDetection() {

    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const streamRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const canvasRef = useRef(null);
    const [reps, setreps] = useState(0);
    const stageleftbicepRef = useRef("down");
    const stagerightbicepRef = useRef("down")


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
        if (!poseLandmarkerRef.current || !videoRef.current || !videoRef.current.srcObject) return;
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
        if (results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            const leftbicepsangle = calculateAngle(
                landmarks[11], // Left Shoulder
                landmarks[13], // Left Elbow
                landmarks[15]  // Left Wrist
            );
            const rightbicepangle = calculateAngle(
                landmarks[12], // right Shoulder
                landmarks[14], // right Elbow
                landmarks[16]  // right Wrist
            );

            if (leftbicepsangle > 160) {
                stageleftbicepRef.current = "down";
            }
            if (leftbicepsangle < 40 && stageleftbicepRef.current === "down") {
                stageleftbicepRef.current = "up"
                setreps(prev => prev + 1);
            }
            if (rightbicepangle > 160) {
                stagerightbicepRef.current = "down";
            }
            if (rightbicepangle < 40 && stagerightbicepRef.current === "down") {
                stagerightbicepRef.current = "up"
                setreps(prev => prev + 1);
            }
            console.log(reps);
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
                <h2>{reps}</h2>
                <div className="pose-video-overlay-glow"></div>
            </div>
        </div>
    );
}