import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Camerahandle from "./cameraupload.jsx";
import PoseDetection from "./posedet.jsx";

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
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={onClose}>
            <div
                className="w-full max-w-4xl max-h-[85vh] bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">{name}</h2>
                        <div className="flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-extrabold uppercase bg-[#ff4b2b]/15 border border-[#ff4b2b]/30 text-[#ff4b2b]">
                                🎯 {target} Target
                            </span>
                            {setsReps && (
                                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                    📋 {setsReps}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 flex items-center justify-center text-sm text-gray-400 transition-all cursor-pointer shrink-0"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {isLoading || !details ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-[#ff4b2b] rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Movement Intelligence...</p>
                    </div>
                ) : (
                    <>
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Side: Media Player */}
                            <div className="bg-[#060913] border border-white/10 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative shadow-inner">
                                {details.mediaType === "video" ? (
                                    details.mediaUrl && details.mediaUrl.trim().startsWith("<iframe") ? (
                                        <div 
                                            className="w-full h-full"
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
                            <div className="space-y-4">
                                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2">
                                    How To Perform
                                </h3>
                                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                                    {details.steps.map((step, index) => (
                                        <div key={index} className="bg-[#121929] border border-white/10 p-3 rounded-2xl flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md">
                                                {index + 1}
                                            </span>
                                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips Section */}
                        {details.tips && details.tips.length > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💡</span>
                                    <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">Coaching Cues & Pro Tips</h4>
                                </div>
                                <ul className="space-y-1.5">
                                    {details.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                                            <span className="text-amber-400 font-bold">•</span>
                                            <p>{tip}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* Bottom Action Footer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <button
                        className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-xs transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        Close Guide
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
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