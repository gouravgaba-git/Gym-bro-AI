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

  const displayReason = reason || authModalReason || "Sign in with Google to generate high-yield AI workout splits, log streak activity, and access movement guides.";

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
    showToast("Google Sign-In popup closed or failed. Please try again.", "error");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0d1322]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-6 text-center">
        {/* Metallic Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#3b82f6]" />

        {/* Modal Close Button if in Overlay */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 flex items-center justify-center text-xs text-gray-400 transition-all cursor-pointer z-10"
            aria-label="Close Auth Modal"
          >
            ✕
          </button>
        )}

        {/* Brand Header */}
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff4b2b]/10 border border-[#ff4b2b]/25 shadow-inner">
            <span className="text-lg">💪</span>
            <span className="font-extrabold text-xs tracking-widest bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent uppercase">
              THE GYM BRO
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Unlock Athlete Access
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs mx-auto font-medium">
            {displayReason}
          </p>
        </div>

        {/* Configuration Warning */}
        {!isClientIdConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3.5 rounded-2xl text-left text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <span>⚠️</span> Google Client ID Required
            </div>
            <p className="text-gray-300">
              To enable Google Sign-In, set <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">VITE_GOOGLE_CLIENT_ID</code> in <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">.env</code>.
            </p>
          </div>
        )}

        {/* GIS Action Button Container */}
        <div className="flex flex-col items-center justify-center pt-2 gap-3">
          {isClientIdConfigured ? (
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                width="320"
                text="continue_with"
              />
            </div>
          ) : (
            <button className="w-full py-3.5 px-6 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold text-sm flex items-center justify-center gap-3 cursor-not-allowed opacity-60" disabled>
              <span>Continue with Google</span>
            </button>
          )}

          {loading && (
            <div className="text-xs font-bold text-[#ff4b2b] animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff4b2b] animate-ping" />
              <span>Authenticating with Google...</span>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
            <span>🔒</span> Instant secure OAuth login. No password required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
