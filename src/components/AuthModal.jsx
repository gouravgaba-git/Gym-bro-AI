import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
  const { loginWithGoogle, showToast } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isClientIdConfigured = googleClientId && googleClientId.trim() !== "" && !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google GIS");
      }
      const user = await loginWithGoogle(credentialResponse.credential);
      if (user && !user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
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
    <div className="auth-card-container">
      <div className="auth-card card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="logo-container">
            <span className="logo-icon" role="img" aria-label="Gym Bro Logo">💪</span>
            <span className="logo-text">The Gym Bro</span>
          </div>
          <h2 className="auth-title">Welcome to The Gym Bro</h2>
          <p className="auth-subtitle">
            Sign in with Google to generate personalized AI workout splits, sync progress, and track athletic streak.
          </p>
        </div>

        {/* Configuration Warning if VITE_GOOGLE_CLIENT_ID is missing */}
        {!isClientIdConfigured && (
          <div className="config-warning-banner">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>Google Client ID Required</strong>
              <p>
                To enable Google Authentication, set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> and <code>GOOGLE_CLIENT_ID</code> in <code>server/.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Action Section */}
        <div className="auth-action-section">
          {isClientIdConfigured ? (
            <div className="gis-button-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                width="340"
                text="continue_with"
              />
            </div>
          ) : (
            <button className="github-style-btn disabled" disabled>
              <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>
          )}

          {loading && <div className="auth-spinner">Authenticating with Google...</div>}
        </div>

        {/* Footer Note */}
        <div className="auth-footer-note">
          <p>🔒 Instant secure login. We never post or share without your permission.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
