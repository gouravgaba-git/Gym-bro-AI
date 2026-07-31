import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { getExerciseRule } from "../exerciseRules/index";
import { evaluatePosePosture } from "../pose/postureEvaluator";
import { updateRepCounter } from "../pose/repCounter";
import { generateFeedback } from "../pose/feedbackEngine";
import { Maximize2, Minimize2 } from "lucide-react";

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

/**
 * Calculates exact canvas coordinates for landmarks accounting for object-fit: cover crop & scale.
 * Note: Mirrors X coordinate (1 - lm.x) to match video feed transform: scaleX(-1).
 */
function getLandmarkCoords(lm, videoWidth, videoHeight, containerWidth, containerHeight) {
  const videoRatio = videoWidth / videoHeight;
  const containerRatio = containerWidth / containerHeight;

  // Mirror X coordinate so canvas landmarks align 1:1 with scaleX(-1) video feed
  const normX = 1 - lm.x;

  let x, y;

  if (containerRatio > videoRatio) {
    const scale = containerWidth / videoWidth;
    const renderedHeight = videoHeight * scale;
    const offsetY = (renderedHeight - containerHeight) / 2;

    x = normX * containerWidth;
    y = (lm.y * renderedHeight) - offsetY;
  } else {
    const scale = containerHeight / videoHeight;
    const renderedWidth = videoWidth * scale;
    const offsetX = (renderedWidth - containerWidth) / 2;

    x = (normX * renderedWidth) - offsetX;
    y = lm.y * containerHeight;
  }

  return { x, y };
}

export default function PoseDetection({ exerciseName }) {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const streamRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Active exercise rule and rep counter state
  const ruleRef = useRef(null);
  const repStateRef = useRef({
    phase: "",
    repCount: 0,
    lastFeedback: "Position yourself in front of the camera.",
    maxDepthReached: 180,
    minElbowAngle: 180,
    maxElbowAngle: 0,
    maxExtension: 0
  });

  // Resolve active exercise rule whenever exerciseName prop changes
  useEffect(() => {
    ruleRef.current = getExerciseRule(exerciseName);
    
    repStateRef.current = {
      phase: "",
      repCount: 0,
      lastFeedback: "Position yourself in front of the camera.",
      maxDepthReached: 180,
      minElbowAngle: 180,
      maxElbowAngle: 0,
      maxExtension: 0
    };
  }, [exerciseName]);

  // Re-attach video stream to videoRef element when toggling fullscreen
  useEffect(() => {
    if (isCameraOn && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn("Video play error:", e));
    }
  }, [isFullScreen, isCameraOn]);

  // Handle ESC key to exit full screen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  async function CreatePoseLandmarker() {
    if (poseLandmarkerRef.current) return;
    try {
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
    } catch (err) {
      console.error("Failed to load PoseLandmarker:", err);
    }
  }

  function drawpose(landmarks) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const rect = video.getBoundingClientRect();
    const containerWidth = rect.width || video.clientWidth;
    const containerHeight = rect.height || video.clientHeight;

    if (!containerWidth || !containerHeight) return;

    if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const videoWidth = video.videoWidth || 1280;
    const videoHeight = video.videoHeight || 720;

    // Helper: validate if landmark is confident & inside frame
    const isValidLM = (lm) => {
      if (!lm) return false;
      const vis = lm.visibility ?? 1;
      if (vis < 0.45) return false;
      if (lm.x < 0.02 || lm.x > 0.98 || lm.y < 0.02 || lm.y > 0.98) return false;
      return true;
    };

    // 1. Draw Glowing Skeleton Connections with Clean Boundary Guard
    ctx.strokeStyle = "rgba(0, 255, 128, 0.85)";
    ctx.lineWidth = Math.max(3, Math.round(containerWidth / 200));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    for (const [i, j] of SKELETON_CONNECTIONS) {
      const lm1 = landmarks[i];
      const lm2 = landmarks[j];
      if (isValidLM(lm1) && isValidLM(lm2)) {
        const p1 = getLandmarkCoords(lm1, videoWidth, videoHeight, containerWidth, containerHeight);
        const p2 = getLandmarkCoords(lm2, videoWidth, videoHeight, containerWidth, containerHeight);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // 2. Draw Major Joint Nodes
    const majorJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 31, 32];
    for (let i = 0; i < landmarks.length; i++) {
      if (!majorJoints.includes(i)) continue;
      
      const lm = landmarks[i];
      if (!isValidLM(lm)) continue;

      const p = getLandmarkCoords(lm, videoWidth, videoHeight, containerWidth, containerHeight);

      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
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
      animationFrameRef.current = requestAnimationFrame(detectpose);
      return;
    }

    try {
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

          // 3. Fast direct DOM update for 60FPS UI smoothness
          updateHUD(feedback);
        }
      }
    } catch (err) {
      console.warn("Pose detection loop warning:", err.message);
    }

    animationFrameRef.current = requestAnimationFrame(detectpose);
  }

  function updateHUD(feedback) {
    // Update reps count
    const repsEl = document.getElementById("hud-reps");
    if (repsEl && repsEl.innerText !== String(feedback.repCount)) {
      repsEl.innerText = feedback.repCount;
    }

    // Update movement phase badge
    const phaseEl = document.getElementById("hud-phase");
    if (phaseEl && phaseEl.innerText !== (feedback.phase || "TRACKING")) {
      phaseEl.innerText = feedback.phase || "TRACKING";
      const phase = feedback.phase;
      if (phase === "LOCKOUT" || phase === "EXTENSION" || phase === "STAND") {
        phaseEl.style.borderColor = "rgb(0, 255, 128)";
        phaseEl.style.color = "rgb(0, 255, 128)";
        phaseEl.style.background = "rgba(0, 255, 128, 0.2)";
      } else if (phase === "PEAK" || phase === "CHEST_TOUCH" || phase === "BOTTOM" || phase === "CONTRACTION") {
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
    if (warningsContainer && feedback.warnings) {
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
    if (anglesContainer && feedback.jointAngles) {
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          detectpose();
        };
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Unable to access camera. Please allow camera permissions in your browser settings.");
    }
  }

  async function stopCamera() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsCameraOn(false);
    setIsFullScreen(false);
  }

  // Camera video player element content
  const cameraContent = (
    <div className={`pose-video-wrapper ${isCameraOn ? "visible" : ""} ${isFullScreen ? "fullscreen-mode" : ""}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="pose-video-feed"
      />
      <canvas
        ref={canvasRef}
        className="pose-canvas" 
      />

      {/* Fullscreen Toggle Button */}
      {isCameraOn && (
        <button
          type="button"
          className="fullscreen-toggle-btn"
          onClick={() => setIsFullScreen(!isFullScreen)}
          title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen AI Coach"}
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}
      
      {/* HUD Display Overlay */}
      {isCameraOn && (
        <div className="pose-hud-overlay">
          {/* Top Bar */}
          <div className="hud-top-bar">
            <div className="hud-panel exercise-panel">
              <div className="hud-label">EXERCISE</div>
              <div className="hud-exercise-title-row">
                <div className="hud-value" id="hud-exercise-name">{exerciseName || "Active Tracking"}</div>
              </div>
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
              <div className="hud-feedback-text" id="hud-feedback">Adjusting position...</div>
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
  );

  return (
    <div className="pose-detection-container">
      {/* Scoped CSS styling for live coaching HUD overlay & canvas alignment */}
      <style dangerouslySetInnerHTML={{__html: `
        .pose-detection-container {
          width: 100%;
        }

        .pose-video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 20px;
          overflow: hidden;
          background: #090c15;
          border: 1px solid rgba(255, 75, 43, 0.3);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 75, 43, 0.12);
          margin-top: 16px;
          display: none;
        }

        .pose-video-wrapper.visible {
          display: block;
        }

        .pose-video-wrapper.fullscreen-mode {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          z-index: 999999 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          border: none !important;
        }

        .fullscreen-camera-portal-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: #090c15 !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .pose-video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
          display: block;
        }

        .pose-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .fullscreen-toggle-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 25;
          background: rgba(15, 21, 36, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .fullscreen-toggle-btn:hover {
          background: rgba(255, 75, 43, 0.35);
          border-color: rgba(255, 75, 43, 0.6);
          transform: scale(1.05);
        }

        .pose-hud-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          pointer-events: none;
        }

        .hud-panel {
          background: rgba(15, 21, 36, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 10px 14px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          pointer-events: auto;
        }

        .hud-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding-right: 48px;
        }

        .exercise-panel {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 220px;
        }

        .hud-exercise-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hud-label {
          font-size: 9px;
          font-weight: 800;
          color: var(--text-muted, #8892b0);
          letter-spacing: 0.8px;
        }

        .hud-value {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hud-phase-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 100px;
          border: 1px solid rgba(0, 180, 255, 0.4);
          color: #00b4ff;
          background: rgba(0, 180, 255, 0.15);
          width: fit-content;
        }

        .score-panel {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 100px;
        }

        .hud-score-container {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .hud-score-max {
          font-size: 11px;
          color: var(--text-muted);
        }

        .hud-score-bar-bg {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          overflow: hidden;
          margin-top: 2px;
        }

        .hud-score-bar-fill {
          height: 100%;
          width: 100%;
          background: #00ff80;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .hud-middle-bar {
          display: flex;
          justify-content: flex-end;
        }

        .angles-panel {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 12px;
          font-size: 11px;
        }

        .angle-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .angle-label {
          color: var(--text-secondary);
        }

        .angle-val {
          font-weight: 700;
          color: #ff4b2b;
        }

        .hud-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
        }

        .feedback-panel {
          flex-grow: 1;
          max-width: 360px;
        }

        .hud-feedback-text {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
        }

        .reps-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
        }

        .hud-reps-value {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 900;
          color: #ff4b2b;
          line-height: 1;
        }

        .hud-warnings-container {
          position: absolute;
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          pointer-events: none;
          z-index: 15;
          width: 90%;
          max-width: 380px;
        }

        .hud-warning-pill {
          background: rgba(239, 68, 68, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid #ef4444;
          color: #ffffff;
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
          text-align: center;
        }

        /* Responsive Mobile HUD Layout (< 768px) */
        @media (max-width: 768px) {
          .pose-video-wrapper:not(.fullscreen-mode) {
            aspect-ratio: 4 / 3;
            min-height: 360px;
          }

          .hud-top-bar {
            padding-right: 40px;
            gap: 8px;
          }

          .exercise-panel {
            max-width: 140px;
            padding: 8px 10px;
          }

          .hud-value {
            font-size: 12px;
          }

          .score-panel {
            min-width: 75px;
            padding: 8px 10px;
          }

          .reps-panel {
            min-width: 60px;
            padding: 8px 10px;
          }

          .hud-reps-value {
            font-size: 20px;
          }

          .hud-middle-bar {
            display: none;
          }

          .feedback-panel {
            padding: 8px 12px;
          }

          .hud-feedback-text {
            font-size: 11.5px;
          }

          .hud-warnings-container {
            top: 60px;
            max-width: 85%;
          }

          .hud-warning-pill {
            padding: 4px 10px;
            font-size: 10px;
          }
        }
      `}} />

      <button
        className={`pose-det-btn ${isCameraOn ? "active" : ""}`}
        onClick={isCameraOn ? stopCamera : startCamera}
      >
        📹 {isCameraOn ? "Stop AI Gym Coach" : "Start AI Gym Coach"}
      </button>

      {/* Normal View vs FullScreen Portal View */}
      {isFullScreen && isCameraOn ? (
        createPortal(
          <div className="fullscreen-camera-portal-overlay">
            {cameraContent}
          </div>,
          document.body
        )
      ) : (
        cameraContent
      )}
    </div>
  );
}