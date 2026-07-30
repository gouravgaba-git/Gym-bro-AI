import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Camerahandle from "./cameraupload.jsx";
import PoseDetection from "./posedet.jsx";
import { API_BASE_URL } from "../config/api.js";

function InfoTemplate({ exercise, onClose }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!exercise) return null;

  // Destructure exercise object with fallback handling
  const name = typeof exercise === "object" ? exercise.name : exercise;
  const target = typeof exercise === "object" ? exercise.target : "Full Body";
  const setsReps = typeof exercise === "object" ? exercise.setsReps : null;

  useEffect(() => {
    // Disable background body scrolling while modal is active
    document.body.style.overflow = "hidden";

    // Fetch instructions and tips dynamically from backend API or local static fallback
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/exercises/details/${encodeURIComponent(name)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response error");
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Backend API detail fetch failed. Using client static fallback module. Error:", err.message);
        import("../data/exerciseDetails.js")
          .then((module) => {
            const localData = module.getExerciseDetails(name, target);
            setDetails(localData);
            setIsLoading(false);
          })
          .catch((importErr) => {
            console.error("Local fallback import failed:", importErr);
            setIsLoading(false);
          });
      });

    return () => {
      // Always restore scrolling when modal closes or unmounts
      document.body.style.overflow = "unset";
    };
  }, [name, target]);

  const handleClose = () => {
    document.body.style.overflow = "unset";
    onClose();
  };

  return createPortal(
    <div
      className="overlay"
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      <div
        className="modal info-modal-custom"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          width: "100%",
          maxWidth: "800px"
        }}
      >
        {/* Header Section */}
        <div className="modal-header-section">
          <div className="modal-title-area">
            <h2 className="modal-exercise-title">{name}</h2>
            <div className="modal-badges-group">
              <span className="modal-badge-target">🎯 {target} Target</span>
              {setsReps && (
                <span className="modal-badge-sets">📋 {setsReps}</span>
              )}
            </div>
          </div>
          <button className="close-modal-btn" onClick={handleClose} aria-label="Close modal">
            ✖
          </button>
        </div>

        {isLoading || !details ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="modal-grid-layout">
              {/* Left Side: Media Container */}
              <div className="modal-media-wrapper">
                {details.mediaType === "video" ? (
                  <video
                    src={details.mediaUrl}
                    className="exercise-media-element"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <div className="image-container-relative">
                    <img
                      src={details.mediaUrl || "/exercise_placeholder.png"}
                      alt={`${name} demonstration`}
                      className="exercise-media-element"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="media-overlay-glow"></div>
                  </div>
                )}
              </div>

              {/* Right Side: Step-by-Step Form Guide */}
              <div className="modal-steps-wrapper">
                <h3 className="section-subtitle">How To Perform</h3>
                <ol className="modern-steps-list">
                  {(details.steps || []).map((step, index) => (
                    <li key={index} className="modern-step-item">
                      <span className="step-number-bubble">{index + 1}</span>
                      <span className="step-text-content">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Bottom Section: Pro Tips & Safety Advice */}
            {details.tips && details.tips.length > 0 && (
              <div className="modal-tips-section">
                <div className="tips-header-row">
                  <span className="tips-icon">💡</span>
                  <h4 className="tips-title">Coaching Cues & Pro Tips</h4>
                </div>
                <ul className="tips-list-custom">
                  {details.tips.map((tip, index) => (
                    <li key={index} className="tip-list-item">
                      <span className="tip-bullet">•</span>
                      <p className="tip-text-body">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Secondary Bottom Close Button */}
        <div className="modal-footer-close">
          <button className="footer-close-btn" onClick={handleClose}>
            Close Guide
          </button>
          <div className="modal-footer-actions">
            <Camerahandle />
            <PoseDetection />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default InfoTemplate;