import { useRef, useState, useEffect } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { getExerciseRule } from "../exerciseRules/index";
import { evaluatePosePosture } from "../pose/postureEvaluator";
import { updateRepCounter } from "../pose/repCounter";
import { generateFeedback } from "../pose/feedbackEngine";

const SKELETON_CONNECTIONS = [
  [11, 12], // Shoulders
  [11, 13], [13, 15], // Left Arm
  [12, 14], [14, 16], // Right Arm
  [11, 23], [12, 24], // Torso sides
  [23, 24], // Hips
  [23, 25], [25, 27], // Left Leg
  [24, 26], [26, 28], // Right Leg
  [27, 29], [29, 31], [27, 31], // Left foot/heel
  [28, 30], [30, 32], [28, 32], // Right foot/heel
];

export default function PoseDetection({ exerciseName }) {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const streamRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const canvasRef = useRef(null);

    // Keep active exercise rule and rep counter state in refs
    // to avoid React re-renders on every animation frame.
    const ruleRef = useRef(null);
    const repStateRef = useRef({
      phase: "",
      repCount: 0,
      lastFeedback: "Position yourself to begin.",
      maxDepthReached: 180,
      minElbowAngle: 180,
      maxElbowAngle: 0,
      maxExtension: 0
    });

    // Resolve the active exercise rule whenever the exerciseName prop changes
    useEffect(() => {
        ruleRef.current = getExerciseRule(exerciseName);
        
        // Reset rep counter state when exercise changes
        repStateRef.current = {
          phase: "",
          repCount: 0,
          lastFeedback: "Position yourself to begin.",
          maxDepthReached: 180,
          minElbowAngle: 180,
          maxElbowAngle: 0,
          maxExtension: 0
        };
    }, [exerciseName]);

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
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Skeleton Connections
        ctx.strokeStyle = "rgba(0, 255, 128, 0.6)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        for (const [i, j] of SKELETON_CONNECTIONS) {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            if (p1 && p2 && p1.visibility > 0.5 && p2.visibility > 0.5) {
                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.stroke();
            }
        }

        // 2. Draw Major Joint Nodes
        const majorJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 31, 32];
        for (let i = 0; i < landmarks.length; i++) {
            if (!majorJoints.includes(i)) continue;
            
            const landmark = landmarks[i];
            if (landmark.visibility !== undefined && landmark.visibility < 0.5) {
                continue;
            }
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#ff4b2b";
            ctx.fill();
            
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
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

        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            const currentRule = ruleRef.current;

            // 1. Draw Skeleton overlays
            drawpose(landmarks);

            if (currentRule) {
                // 2. High-performance modular analysis
                const postureResult = evaluatePosePosture(landmarks, currentRule);
                const repResult = updateRepCounter(landmarks, postureResult.angles, repStateRef.current, currentRule);
                const feedback = generateFeedback(postureResult, repResult, repStateRef.current);

                // 3. Fast direct DOM update to bypass React re-renders on animation frame
                updateHUD(feedback);
            }
        }

        requestAnimationFrame(detectpose);
    }

    function updateHUD(feedback) {
        // Update reps count
        const repsEl = document.getElementById("hud-reps");
        if (repsEl && repsEl.innerText !== String(feedback.repCount)) {
            repsEl.innerText = feedback.repCount;
        }

        // Update movement phase
        const phaseEl = document.getElementById("hud-phase");
        if (phaseEl && phaseEl.innerText !== feedback.phase) {
            phaseEl.innerText = feedback.phase;
            if (feedback.phase === "LOCKOUT" || feedback.phase === "EXTENSION" || feedback.phase === "STAND") {
                phaseEl.style.borderColor = "rgb(0, 255, 128)";
                phaseEl.style.color = "rgb(0, 255, 128)";
                phaseEl.style.background = "rgba(0, 255, 128, 0.2)";
            } else if (feedback.phase === "PEAK" || feedback.phase === "CHEST_TOUCH" || feedback.phase === "BOTTOM" || feedback.phase === "CONTRACTION") {
                phaseEl.style.borderColor = "rgb(255, 200, 0)";
                phaseEl.style.color = "rgb(255, 200, 0)";
                phaseEl.style.background = "rgba(255, 200, 0, 0.2)";
            } else {
                phaseEl.style.borderColor = "rgb(0, 180, 255)";
                phaseEl.style.color = "rgb(0, 180, 255)";
                phaseEl.style.background = "rgba(0, 180, 255, 0.2)";
            }
        }

        // Update form score
        const scoreEl = document.getElementById("hud-score");
        if (scoreEl && scoreEl.innerText !== String(feedback.formScore)) {
            scoreEl.innerText = feedback.formScore;
        }

        const scoreBarEl = document.getElementById("hud-score-bar");
        if (scoreBarEl) {
            scoreBarEl.style.width = `${feedback.formScore}%`;
            if (feedback.formScore > 80) {
                scoreBarEl.style.backgroundColor = "#00ff80";
            } else if (feedback.formScore > 50) {
                scoreBarEl.style.backgroundColor = "#ffc800";
            } else {
                scoreBarEl.style.backgroundColor = "#ff4444";
            }
        }

        // Update feedback text
        const fbEl = document.getElementById("hud-feedback");
        if (fbEl && fbEl.innerText !== feedback.feedback) {
            fbEl.innerText = feedback.feedback;
            if (feedback.feedback.includes("Excellent") || feedback.feedback.includes("Good") || feedback.feedback.includes("Solid")) {
                fbEl.style.color = "#00ff80";
            } else if (feedback.feedback.includes("Extend") || feedback.feedback.includes("deeper") || feedback.feedback.includes("fixed") || feedback.feedback.includes("vertical")) {
                fbEl.style.color = "#ffc800";
            } else {
                fbEl.style.color = "#ffffff";
            }
        }

        // Update warnings list
        const warningsContainer = document.getElementById("hud-warnings");
        if (warningsContainer) {
            const currentText = Array.from(warningsContainer.children).map(child => child.innerText).join("|");
            const newText = feedback.warnings.join("|");
            if (currentText !== newText) {
                warningsContainer.innerHTML = "";
                feedback.warnings.forEach(warn => {
                    const pill = document.createElement("div");
                    pill.className = "hud-warning-pill";
                    pill.innerHTML = `<span class="hud-warning-pill-icon">⚠️</span> ${warn}`;
                    warningsContainer.appendChild(pill);
                });
            }
        }

        // Update joint angles
        const anglesContainer = document.getElementById("hud-angles-list");
        if (anglesContainer) {
            const currentText = Array.from(anglesContainer.children).map(child => child.innerText).join("|");
            const newText = feedback.jointAngles.map(a => `${a.label}: ${a.value}°`).join("|");
            if (currentText !== newText) {
                anglesContainer.innerHTML = "";
                feedback.jointAngles.forEach(angle => {
                    const row = document.createElement("div");
                    row.className = "angle-row";
                    row.innerHTML = `<span class="angle-label">${angle.label}</span><span class="angle-val">${angle.value}°</span>`;
                    anglesContainer.appendChild(row);
                });
            }
        }
    }

    async function startCamera() {
        await CreatePoseLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 }
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
            detectpose();
        };
        setIsCameraOn(true);
    }

    async function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    }

    return (
        <div className="pose-detection-container">
            {/* Scoped CSS styling for live coaching HUD overlay */}
            <style dangerouslySetInnerHTML={{__html: `
                .pose-hud-overlay {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 16px;
                    font-family: system-ui, -apple-system, sans-serif;
                    box-sizing: border-box;
                    color: #ffffff;
                }
                .hud-top-bar, .hud-bottom-bar {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    gap: 12px;
                }
                .hud-panel {
                    background: rgba(9, 12, 21, 0.75);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 10px 14px;
                    display: flex;
                    flex-direction: column;
                    pointer-events: auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                }
                .exercise-panel {
                    min-width: 180px;
                    align-items: flex-start;
                }
                .hud-label {
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    color: #8892b0;
                    margin-bottom: 2px;
                    text-transform: uppercase;
                }
                .hud-value {
                    font-size: 16px;
                    font-weight: 800;
                    color: #ffffff;
                }
                .hud-phase-badge {
                    margin-top: 4px;
                    border: 1px solid rgb(0, 180, 255);
                    color: rgb(0, 180, 255);
                    background: rgba(0, 180, 255, 0.15);
                    padding: 1px 6px;
                    border-radius: 4px;
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .score-panel {
                    width: 120px;
                    align-items: flex-end;
                }
                .hud-score-container {
                    display: flex;
                    align-items: baseline;
                }
                .hud-score-max {
                    font-size: 10px;
                    color: #8892b0;
                    margin-left: 1px;
                }
                .hud-score-bar-bg {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 2px;
                    margin-top: 4px;
                    overflow: hidden;
                }
                .hud-score-bar-fill {
                    height: 100%;
                    background: #00ff80;
                    width: 100%;
                }
                .hud-middle-bar {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                }
                .angles-panel {
                    background: rgba(9, 12, 21, 0.65);
                    padding: 8px 12px;
                    font-size: 11px;
                    gap: 3px;
                    min-width: 130px;
                }
                .angle-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                }
                .angle-label {
                    color: #8892b0;
                }
                .angle-val {
                    color: #00ff80;
                    font-weight: 700;
                }
                .feedback-panel {
                    flex-grow: 1;
                    align-items: flex-start;
                    justify-content: center;
                }
                .hud-feedback-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: #ffffff;
                    line-height: 1.3;
                }
                .reps-panel {
                    width: 70px;
                    align-items: center;
                    justify-content: center;
                }
                .hud-reps-value {
                    font-size: 28px;
                    font-weight: 900;
                    color: #ff4b2b;
                    line-height: 1;
                }
                .hud-warnings-container {
                    position: absolute;
                    bottom: 80px;
                    left: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    max-width: 70%;
                }
                .hud-warning-pill {
                    background: rgba(239, 68, 68, 0.25);
                    border: 1px solid #ef4444;
                    color: #ffffff;
                    border-radius: 16px;
                    padding: 4px 10px;
                    font-size: 10px;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
                    animation: slideIn 0.2s ease-out;
                }
                @keyframes slideIn {
                    from { transform: translateX(-8px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}} />

            <button
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border flex items-center gap-2 ${
                    isCameraOn
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                        : "bg-[#ff4b2b] text-white border-transparent hover:bg-[#ff416c] shadow-md shadow-[#ff4b2b]/20"
                }`}
                onClick={isCameraOn ? stopCamera : startCamera}
            >
                📹 {isCameraOn ? "Stop AI Gym Coach" : "Start AI Gym Coach"}
            </button>

            <div className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#060913] shadow-2xl ${isCameraOn ? "block" : "hidden"}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto object-cover"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                />
                
                {/* HUD Display Overlay */}
                {isCameraOn && (
                    <div className="pose-hud-overlay">
                        {/* Top Bar */}
                        <div className="hud-top-bar">
                            <div className="hud-panel exercise-panel">
                                <div className="hud-label">EXERCISE</div>
                                <div className="hud-value" id="hud-exercise-name">{exerciseName || "Active Tracking"}</div>
                                <div className="hud-phase-badge" id="hud-phase">START</div>
                            </div>
                            
                            <div className="hud-panel score-panel">
                                <div className="hud-label">FORM SCORE</div>
                                <div className="hud-score-container">
                                    <span className="hud-value" id="hud-score">100</span>
                                    <span className="hud-score-max">/100</span>
                                </div>
                                <div className="hud-score-bar-bg">
                                    <div className="hud-score-bar-fill" id="hud-score-bar"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Middle Bar for joint angles */}
                        <div className="hud-middle-bar">
                            <div className="hud-panel angles-panel" id="hud-angles-list">
                                {/* Populate programmatically */}
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="hud-bottom-bar">
                            <div className="hud-panel feedback-panel">
                                <div className="hud-label">AI COACH FEEDBACK</div>
                                <div className="hud-feedback-text" id="hud-feedback">Adjusting camera...</div>
                            </div>
                            
                            <div className="hud-panel reps-panel">
                                <div className="hud-label">REPS</div>
                                <div className="hud-reps-value" id="hud-reps">0</div>
                            </div>
                        </div>
                        
                        {/* Warnings overlay */}
                        <div className="hud-warnings-container" id="hud-warnings">
                            {/* Populate programmatically */}
                        </div>
                    </div>
                )}
                
                <div className="pose-video-overlay-glow"></div>
            </div>
        </div>
    );
}