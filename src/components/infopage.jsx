import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X, Sparkles, Target, Dumbbell, Lightbulb, Video, Loader2 } from "lucide-react";
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
        console.warn(
          "Backend API detail fetch failed. Using client static fallback module. Error:",
          err.message
        );
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative my-8 flex w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl text-foreground max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                <Target className="size-3 text-muted-foreground" />
                {target}
              </span>
              {setsReps && (
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  <Dumbbell className="size-3 text-muted-foreground" />
                  {setsReps}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer border-0 bg-transparent transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col gap-6 p-6">
          {isLoading || !details ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Loader2 className="size-8 animate-spin text-foreground" />
              <p className="text-sm text-muted-foreground font-medium">
                Loading Movement Guide & Form Protocol...
              </p>
            </div>
          ) : (
            <>
              {/* Media & Steps Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left: Media Container */}
                <div className="overflow-hidden rounded-xl border border-border bg-secondary/30 flex items-center justify-center min-h-[220px]">
                  {details.mediaType === "video" ? (
                    details.mediaUrl && details.mediaUrl.trim().startsWith("<iframe") ? (
                      <div
                        className="w-full aspect-video [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                        dangerouslySetInnerHTML={{ __html: details.mediaUrl }}
                      />
                    ) : (
                      <video
                        src={details.mediaUrl}
                        className="w-full aspect-video object-cover rounded-lg"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    )
                  ) : (
                    <img
                      src={details.mediaUrl || "/exercise_placeholder.png"}
                      alt={`${name} demonstration`}
                      className="w-full aspect-video object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  )}
                </div>

                {/* Right: How To Perform Steps */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    How To Perform
                  </h3>
                  <ol className="flex flex-col gap-2.5 list-none p-0 m-0">
                    {(details.steps || []).map((step, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-foreground text-pretty">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Coaching Cues & Pro Tips */}
              {details.tips && details.tips.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="size-4 text-amber-400" />
                    <h4 className="text-sm font-semibold tracking-tight text-foreground">
                      Coaching Cues & Pro Tips
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-1.5 list-none p-0 m-0 text-sm text-muted-foreground">
                    {details.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Live AI Form-Check & Computer Vision HUD */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-foreground" />
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Live AI Form-Check & Skeletal Tracking
                  </h3>
                </div>
                <PoseDetection exerciseName={name} />
              </div>
            </>
          )}
        </div>

        {/* Footer Section */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-border bg-card/95 backdrop-blur-sm px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors"
          >
            Close Guide
          </button>
          <div>
            <Camerahandle />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default InfoTemplate;