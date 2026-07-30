import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ onClose, reason }) => {
  const { loginWithGoogle, showToast, authModalReason, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isClientIdConfigured = googleClientId && googleClientId.trim() !== "" && !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  const displaySubtitle = reason || authModalReason || "AI-powered workout plans, form analysis, and progress tracking.";

  // Initialize Native GoogleAuth on Component Mount if on Native Platform
  useEffect(() => {
    if (Capacitor.isNativePlatform() && isClientIdConfigured) {
      try {
        console.log("Initializing Native GoogleAuth with Client ID:", googleClientId);
        GoogleAuth.initialize({
          clientId: googleClientId,
          scopes: ["profile", "email"],
          grantOfflineAccess: true
        });
      } catch (err) {
        console.error("GoogleAuth.initialize error:", err);
      }
    }
  }, [isClientIdConfigured, googleClientId]);

  const handleClose = () => {
    if (onClose) onClose();
    closeAuthModal();
  };

  const handleGoogleError = (err) => {
    console.error("Google Sign-In error:", err);
    showToast("Google Sign-In closed or failed. Please try again.", "error");
  };

  const webGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const profile = await res.json();
        const user = await loginWithGoogle(profile);
        if (user && !user.isProfileComplete) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google OAuth error:", err);
        showToast("Google sign in failed. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    onError: handleGoogleError
  });

  const handleSignInClick = async () => {
    console.log("Sign-in button tapped. Platform isNativePlatform:", Capacitor.isNativePlatform());
    console.log("Current Client ID:", googleClientId);

    if (Capacitor.isNativePlatform()) {
      try {
        setLoading(true);
        const googleUser = await GoogleAuth.signIn();
        console.log("Native GoogleAuth user response:", JSON.stringify(googleUser, null, 2));

        const idToken = googleUser.authentication?.idToken || googleUser.idToken;

        let payload;
        if (idToken) {
          payload = idToken;
        } else {
          payload = {
            sub: googleUser.id,
            email: googleUser.email,
            name: googleUser.name || googleUser.givenName,
            picture: googleUser.imageUrl
          };
        }

        const user = await loginWithGoogle(payload);
        if (user && !user.isProfileComplete) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Capacitor Native GoogleAuth error:", err);
        console.error("Error JSON:", JSON.stringify(err, null, 2));
        
        const errDetails = err?.message || err?.error || (typeof err === "string" ? err : JSON.stringify(err));
        showToast(`Native Google Sign-In Error: ${errDetails}`, "error");
      } finally {
        setLoading(false);
      }
    } else {
      webGoogleLogin();
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        {onClose && (
          <button
            onClick={handleClose}
            className="modal-close-btn auth-close-btn"
            aria-label="Close Auth Modal"
          >
            ✕
          </button>
        )}
        
        {/* Brand Header */}
        <div className="auth-header">
          <div className="logo-container auth-logo">
            <span className="logo-icon" role="img" aria-label="Gym Bro Logo">💪</span>
            <span className="logo-text">The Gym Bro</span>
          </div>
          <h2 className="auth-title">Welcome to The Gym Bro</h2>
          <p className="auth-subtitle">{displaySubtitle}</p>
        </div>

        {/* Configuration Warning if VITE_GOOGLE_CLIENT_ID is missing */}
        {!isClientIdConfigured && (
          <div className="config-warning-banner">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>Google Client ID Required</strong>
              <p>
                To enable Google Authentication, set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Single Primary Action Section - Compatible with Web & Native Capacitor Android */}
        <div className="auth-action-section">
          <button
            type="button"
            onClick={handleSignInClick}
            disabled={loading || !isClientIdConfigured}
            className={`auth-btn-custom ${!isClientIdConfigured ? "disabled" : ""}`}
          >
            <svg className="google-icon" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? "Authenticating..." : "Sign in with Google"}</span>
          </button>
        </div>

        {/* Terms & Privacy Note */}
        <div className="auth-footer-note">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
