import React, { useState, useEffect, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  X,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AuthModal = ({ onClose, reason, isPage = false }) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    register,
    verifyOtp,
    resendOtp,
    showToast,
    authModalReason,
    closeAuthModal
  } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'register' | 'otp'
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP State (6 digits)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef([]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isClientIdConfigured =
    googleClientId &&
    googleClientId.trim() !== "" &&
    !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  const displaySubtitle = reason || authModalReason;
  const isNative = Capacitor.isNativePlatform();

  // Cooldown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input when switching to OTP mode
  useEffect(() => {
    if (mode === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [mode]);

  // Initialize Native GoogleAuth on Mount if on Native Platform
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

  const handleAuthSuccess = (authenticatedUser) => {
    if (authenticatedUser && !authenticatedUser.isProfileComplete) {
      navigate("/complete-profile");
    } else {
      navigate("/dashboard");
    }
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
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            }
          );

          if (!userInfoRes.ok) {
            throw new Error("Could not fetch user profile from Google");
          }

          const profileData = await userInfoRes.json();
          const user = await loginWithGoogle({ profile: profileData });
          handleAuthSuccess(user);
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

  // Handle Google Button Click
  const handleGoogleClick = async () => {
    if (loading) return;

    if (isNative) {
      try {
        setLoading(true);
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication?.idToken || googleUser.idToken;
        const user = await loginWithGoogle(idToken || googleUser);
        handleAuthSuccess(user);
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
      showToast("Google OAuth Client ID is not configured. Use manual login with email.", "info");
    }
  };

  // Handle Sign In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await loginWithEmail(email.trim(), password);
      if (res?.requireOtp) {
        setMode("otp");
        setResendCooldown(60);
      } else if (res) {
        handleAuthSuccess(res);
      }
    } catch (err) {
      // Error handled by AuthContext showToast
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please fill all required fields", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim() || email.split("@")[0],
        username: name.trim().toLowerCase().replace(/\s+/g, "_") || email.split("@")[0],
        email: email.trim(),
        password
      });
      setMode("otp");
      setResendCooldown(60);
      setOtpValues(["", "", "", "", "", ""]);
    } catch (err) {
      // Error handled by AuthContext showToast
    } finally {
      setLoading(false);
    }
  };

  const isSubmittingRef = useRef(false);

  // Handle Individual OTP Digits
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal) {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      return;
    }

    // Handle single digit
    const digit = cleanVal.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = digit;
    setOtpValues(newOtp);

    // Auto focus next input
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitOtpVerification();
    }
  };

  // Handle Pasting full OTP code (e.g. "582914")
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtpValues(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Submit OTP Verification
  const submitOtpVerification = async (otpCodeToVerify) => {
    if (isSubmittingRef.current || loading) return;

    const code = (otpCodeToVerify || otpValues.join("")).trim();
    if (code.length !== 6) {
      showToast("Please enter the complete 6-digit OTP code", "error");
      return;
    }

    try {
      isSubmittingRef.current = true;
      setLoading(true);
      const user = await verifyOtp({
        email: email.trim(),
        otp: code
      });
      if (user) {
        handleAuthSuccess(user);
      }
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    try {
      setLoading(true);
      await resendOtp(email.trim());
      setResendCooldown(60);
      setOtpValues(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl text-foreground text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Modal Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer border-0 bg-transparent transition-colors"
          aria-label="Close"
        >
          <X className="size-4.5" />
        </button>
      )}

      {/* Brand Icon */}
      <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background shadow-sm mb-3">
        <Dumbbell className="size-6" />
      </div>

      <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
        The Gym Bro
      </h1>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5 mb-5">
        Athlete Portal & AI Coach
      </p>

      {displaySubtitle && (
        <div className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground mb-4 leading-relaxed">
          {displaySubtitle}
        </div>
      )}

      {/* Mode Selector Tabs (Sign In / Sign Up) - Hidden during OTP verification */}
      {mode !== "otp" && (
        <div className="grid grid-cols-2 w-full p-1 rounded-xl bg-secondary/60 border border-border mb-5">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
              mode === "register"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SIGN IN FORM */}
      {/* ========================================================================= */}
      {mode === "login" && (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5 w-full">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5" /> Email
            </label>
            <input
              type="email"
              placeholder="athlete@gymbro.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="size-3.5" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          {/* Sign In Submit Button */}
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
              <span>Sign In</span>
            )}
          </button>

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
            <span>Continue with Google</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTER / CREATE ACCOUNT FORM */}
      {/* ========================================================================= */}
      {mode === "register" && (
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5 w-full">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5" /> Full Name or Username
            </label>
            <input
              type="text"
              placeholder="e.g. Gourav Gaba"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5" /> Email Address
            </label>
            <input
              type="email"
              placeholder="athlete@gymbro.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="size-3.5" /> Password (Min. 6 characters)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending OTP Code...</span>
              </>
            ) : (
              <span>Create Account & Send OTP</span>
            )}
          </button>

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
            <span>Continue with Google</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. OTP VERIFICATION FORM */}
      {/* ========================================================================= */}
      {mode === "otp" && (
        <div className="flex flex-col items-center w-full animate-in fade-in duration-200">
          <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground mb-3">
            <KeyRound className="size-5" />
          </div>

          <h2 className="text-base font-bold text-foreground mb-1">
            Enter Verification Code
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-xs">
            We sent a 6-digit one-time code to <br />
            <strong className="text-foreground font-semibold">{email}</strong>
          </p>

          {/* 6 Digit Input Boxes */}
          <div
            className="flex items-center justify-center gap-2 mb-6 w-full"
            onPaste={handleOtpPaste}
          >
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (otpInputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                disabled={loading}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="size-11 sm:size-12 rounded-xl border border-border bg-background text-center text-lg font-mono font-bold text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground focus:outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => submitOtpVerification()}
            disabled={loading || otpValues.join("").length !== 6}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-sm disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Verify & Activate Account</span>
              </>
            )}
          </button>

          {/* Resend Code & Back Buttons */}
          <div className="flex items-center justify-between w-full mt-5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setMode("register")}
              disabled={loading}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer border-0 bg-transparent p-0"
            >
              <ArrowLeft className="size-3.5" />
              <span>Change Email</span>
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || loading}
              className={`flex items-center gap-1.5 transition-colors border-0 bg-transparent p-0 ${
                resendCooldown > 0
                  ? "text-muted-foreground cursor-not-allowed opacity-60"
                  : "text-foreground font-semibold hover:underline cursor-pointer"
              }`}
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </span>
            </button>
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground mt-6 m-0">
        Secure athlete authentication &bull; The Gym Bro AI
      </p>
    </div>
  );
};

export default AuthModal;
