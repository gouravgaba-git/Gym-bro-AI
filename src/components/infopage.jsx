import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Camerahandle from "./cameraupload.jsx";
import PoseDetection from "./posedet.jsx";
import { API_BASE_URL } from "../config/api";

function InfoTemplate({ exercise, onClose }) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

        document.body.style.overflow = "hidden";

        fetch(`${API_BASE_URL}/api/exercises/details/${encodeURIComponent(name)}`)
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
            document.body.style.overflow = "auto";
        };
    }, [exercise, name, target]);

    if (!exercise) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onClose}>
            <div
                className="w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] bg-[#0f172a] border border-white/10 rounded-2xl p-4 sm:p-7 shadow-2xl overflow-y-auto flex flex-col gap-5 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div className="space-y-1.5">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{name}</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                                🎯 {target}
                            </span>
                            {setsReps && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
                                    📋 {setsReps}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 flex items-center justify-center text-xs text-slate-400 transition-all cursor-pointer shrink-0"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {isLoading || !details ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-10 h-10 border-3 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Loading exercise details...</p>
                    </div>
                ) : (
                    <>
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Left Side: Media Player */}
                            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative shadow-inner">
                                {details.mediaType === "video" ? (
                                    details.mediaUrl && details.mediaUrl.trim().startsWith("<iframe") ? (
                                        <div 
                                            className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:block"
                                            dangerouslySetInnerHTML={{ __html: details.mediaUrl }}
                                        />
                                    ) : (
                                        <video
                                            src={details.mediaUrl}
                                            className="w-full h-full object-cover"
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full relative">
                                        <img
                                            src={details.mediaUrl || "/exercise_placeholder.png"}
                                            alt={`${name} demonstration`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Step-by-Step Form Guide */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/10 pb-1.5">
                                    Step-by-Step Guide
                                </h3>
                                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                                    {details.steps.map((step, index) => (
                                        <div key={index} className="bg-slate-900/60 border border-white/5 p-2.5 rounded-xl flex items-start gap-2.5">
                                            <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {index + 1}
                                            </span>
                                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips Section */}
                        {details.tips && details.tips.length > 0 && (
                            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-base">💡</span>
                                    <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Form Tips</h4>
                                </div>
                                <ul className="space-y-1">
                                    {details.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-normal">
                                            <span className="text-blue-400 font-bold">•</span>
                                            <p>{tip}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* Bottom Action Footer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <button
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-xs transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
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