import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ onClose, reason, isPage = false }) => {
  const { loginWithGoogle, loginWithEmail, showToast, authModalReason, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isClientIdConfigured =
    googleClientId &&
    googleClientId.trim() !== "" &&
    !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  const displaySubtitle = reason || authModalReason;
  const isNative = Capacitor.isNativePlatform();

  // Initialize Native GoogleAuth on Component Mount if on Native Platform
  useEffect(() => {
    if (isNative && isClientIdConfigured) {
      try {
        GoogleAuth.initialize({
          clientId: googleClientId,
          scopes: ["profile", "email"],
          grantOfflineAccess: true
        });
      } catch (err) {
        console.error("GoogleAuth.initialize error:", err);
      }
    }
  }, [isNative, isClientIdConfigured, googleClientId]);

  const handleClose = () => {
    if (onClose) onClose();
    closeAuthModal();
  };

  // Google OAuth Hook for Web
  let triggerWebGoogleLogin = null;
  try {
    triggerWebGoogleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        try {
          setLoading(true);
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });

          if (!userInfoRes.ok) {
            throw new Error("Could not fetch user profile from Google");
          }

          const profileData = await userInfoRes.json();
          const user = await loginWithGoogle({ profile: profileData });

          if (user && !user.isProfileComplete) {
            navigate("/complete-profile");
          } else {
            navigate("/dashboard");
          }
        } catch (err) {
          console.error("Google Profile Auth error:", err);
          showToast("Google authentication failed. Please try again.", "error");
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error("Google GIS Login Error:", err);
        showToast("Google Sign-In was cancelled or failed.", "error");
      }
    });
  } catch (hookError) {
    console.warn("useGoogleLogin initialization:", hookError);
  }

  // Handle Google Sign In button click (Native or Web)
  const handleGoogleClick = async () => {
    if (loading) return;

    if (isNative) {
      try {
        setLoading(true);
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication?.idToken || googleUser.idToken;
        const user = await loginWithGoogle(idToken || googleUser);
        if (user && !user.isProfileComplete) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Native GoogleAuth error:", err);
        showToast(`Google Sign-In Error: ${err?.message || "Failed"}`, "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isClientIdConfigured && triggerWebGoogleLogin) {
      try {
        triggerWebGoogleLogin();
      } catch (err) {
        console.error("Web Google Login launch error:", err);
        showToast("Unable to start Google sign in. Please try again.", "error");
      }
    } else {
      // Demo / Quick Sign-In fallback when Client ID isn't configured
      try {
        setLoading(true);
        const demoUser = await loginWithEmail(
          email.trim() || "athlete@gymbro.ai",
          password || "demo123"
        );
        if (demoUser && !demoUser.isProfileComplete) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        showToast("Sign in failed. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Email / Password Form Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }

    try {
      setLoading(true);
      const user = await loginWithEmail(email.trim(), password);
      if (user && !user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      showToast(err.message || "Failed to sign in", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gymbro-auth-card">
      {/* Modal Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="gymbro-modal-close-btn"
          aria-label="Close"
        >
          ✕
        </button>
      )}

      {/* Logo */}
      <div className="gymbro-logo-badge">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M6.5 6.5L3 10M17.5 17.5L21 14M11 4.5L13 2.5M13 21.5L11 19.5M4.5 11L2.5 13M19.5 13L21.5 11M8.5 4.5L4.5 8.5M19.5 15.5L15.5 19.5M15.5 4.5L19.5 8.5M4.5 15.5L8.5 19.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 7L17 17"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h1 className="gymbro-title">The Gym Bro</h1>

      {displaySubtitle && (
        <p className="text-white/60 text-xs sm:text-sm text-center -mt-6 mb-8 px-2 leading-relaxed">
          {displaySubtitle}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleEmailSubmit} className="gymbro-form">
        <div className="gymbro-input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="gymbro-input"
          />
        </div>

        <div className="gymbro-input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="gymbro-input"
          />
        </div>

        {/* Optional quick email sign-in button if email is entered */}
        {email.trim().length > 0 && (
          <button
            type="submit"
            disabled={loading}
            className="gymbro-email-submit-btn"
          >
            {loading ? "Signing in..." : "Sign In with Email"}
          </button>
        )}

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          className="gymbro-google-btn"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="gymbro-google-text">
            {loading ? "Authenticating..." : "Continue with Google"}
          </span>
        </button>
      </form>

      <p className="gymbro-footer-text">
        Secure authentication powered by Google
      </p>
    </div>
  );
};

export default AuthModal;
