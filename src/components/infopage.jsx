import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Camerahandle from "./cameraupload.jsx";
import PoseDetection from "./posedet.jsx";

function InfoTemplate({ exercise, onClose }) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Destructure exercise object with fallback handling safely
    const name = exercise && typeof exercise === "object" ? exercise.name : (exercise || "");
    const target = exercise && typeof exercise === "object" ? exercise.target : "Full Body";
    const setsReps = exercise && typeof exercise === "object" ? exercise.setsReps : null;

    const [prevName, setPrevName] = useState(null);
    if (name !== prevName) {
        setPrevName(name);
        setIsLoading(true);
        setDetails(null);
    }

    useEffect(() => {
        if (!exercise) return;

        // Disable background scrolling when modal is open
        document.body.style.overflow = "hidden";

        // Fetch instructions and tips dynamically from the backend API
        fetch(`http://localhost:5000/api/exercises/details/${encodeURIComponent(name)}`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setDetails(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.warn("Backend API unreachable for details. Loading local static fallback. Error:", err.message);
                // Graceful fallback to client-side data module via dynamic import
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
            // Restore scrolling when modal closes
            document.body.style.overflow = "auto";
        };
    }, [exercise, name, target]);

    if (!exercise) return null;

    return createPortal(
        <div className="overlay" onClick={onClose}>
            <div
                className="modal info-modal-custom"
                onClick={(e) => e.stopPropagation()}
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
                    <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
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
                            {/* Left Side: Media Container (Future-Proofed for Video) */}
                            <div className="modal-media-wrapper">
                                {details.mediaType === "video" ? (
                                    /* 
                                       Future Video Player Block:
                                       To use video in the future, set mediaType to 'video' and mediaUrl to your file/embed link.
                                    */
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
                                        />
                                        <div className="media-overlay-glow"></div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Step-by-Step Form Guide */}
                            <div className="modal-steps-wrapper">
                                <h3 className="section-subtitle">How To Perform</h3>
                                <ol className="modern-steps-list">
                                    {details.steps.map((step, index) => (
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
                    <button className="footer-close-btn" onClick={onClose}>
                        Close Guide
                    </button>
                    <div className="modal-footer-actions">
                        <Camerahandle />
                        <PoseDetection exerciseName={name} />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default InfoTemplate;