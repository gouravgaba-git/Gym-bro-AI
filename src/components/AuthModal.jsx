import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useNavigate } from "react-router-dom";
import { Dumbbell, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AuthModal = ({ onClose, reason, isPage = false }) => {
  const { loginWithGoogle, loginWithEmail, showToast, authModalReason, closeAuthModal } =
    useAuth();
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

  // Initialize Native GoogleAuth on Mount if on Native Platform
  useEffect(() => {
    if (isNative && isClientIdConfigured) {
      try {
        GoogleAuth.initialize({
          clientId: googleClientId,
          scopes: ["profile", "email"],
          grantOfflineAccess: true,
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
          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );

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
      },
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
      // Quick Sign-In fallback for development/demo
      try {
        setLoading(true);
        const demoUser = await loginWithEmail(
          email.trim() || "athlete@gymbro.app",
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
    <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl text-foreground text-center">
      {/* Modal Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer border-0 bg-transparent"
          aria-label="Close"
        >
          <X className="size-4.5" />
        </button>
      )}

      {/* Brand Icon */}
      <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background shadow-sm mb-4">
        <Dumbbell className="size-6" />
      </div>

      <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
        The Gym Bro
      </h1>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1 mb-6">
        Athlete Portal & AI Coach
      </p>

      {displaySubtitle && (
        <div className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground mb-5 leading-relaxed">
          {displaySubtitle}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3.5 w-full">
        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-semibold text-muted-foreground">Email</label>
          <input
            type="email"
            placeholder="athlete@gymbro.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-semibold text-muted-foreground">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>

        {/* Email Submit Button */}
        {email.trim().length > 0 && (
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In with Email</span>
            )}
          </button>
        )}

        <div className="relative my-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-card px-2 text-[11px] font-semibold text-muted-foreground uppercase">
            or
          </span>
        </div>

        {/* Google GIS Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-secondary/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
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
          <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
        </button>
      </form>

      <p className="text-[11px] text-muted-foreground mt-5 m-0">
        Secure athlete authentication powered by Google
      </p>
    </div>
  );
};

export default AuthModal;
