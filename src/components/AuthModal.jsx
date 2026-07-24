import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ onClose, reason }) => {
  const { loginWithGoogle, showToast, authModalReason, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isClientIdConfigured = googleClientId && googleClientId.trim() !== "" && !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  const displayReason = reason || authModalReason || "Sign in to save custom workout splits and track your activity.";

  const handleClose = () => {
    if (onClose) onClose();
    closeAuthModal();
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google GIS");
      }
      const user = await loginWithGoogle(credentialResponse.credential);
      if (user && !user.isProfileComplete) {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("GIS Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showToast("Google Sign-In failed or closed. Please try again.", "error");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0f172a]/95 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-5 text-center">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-red-600" />

        {/* Modal Close Button */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 flex items-center justify-center text-xs text-slate-400 transition-all cursor-pointer z-10"
            aria-label="Close Auth Modal"
          >
            ✕
          </button>
        )}

        {/* Brand Header */}
        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-base">💪</span>
            <span className="font-extrabold text-xs tracking-wider text-white uppercase">
              GYM<span className="text-blue-400">BRO</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sign In Required
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-normal">
            {displayReason}
          </p>
        </div>

        {/* Configuration Warning */}
        {!isClientIdConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl text-left text-xs space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-400">
              <span>⚠️</span> Google Client ID Required
            </div>
            <p className="text-slate-300">
              Please set <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">VITE_GOOGLE_CLIENT_ID</code> in <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">.env</code>.
            </p>
          </div>
        )}

        {/* GIS Action Button Container */}
        <div className="flex flex-col items-center justify-center pt-1 gap-2.5">
          {isClientIdConfigured ? (
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                width="300"
                text="continue_with"
              />
            </div>
          ) : (
            <button className="w-full py-3 px-5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-medium text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-60" disabled>
              <span>Continue with Google</span>
            </button>
          )}

          {loading && (
            <div className="text-xs font-semibold text-blue-400 animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Authenticating...</span>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] text-slate-500 font-normal flex items-center justify-center gap-1">
            <span>🔒</span> Instant secure Google authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
