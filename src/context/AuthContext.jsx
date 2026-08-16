import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("gym_bro_token") || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  // Auth Modal State for prompting unauthenticated users when performing protected tasks
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openAuthModal = (reason = "") => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason("");
  };

  // Fetch current user from backend database on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("Session expired or invalid token");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.warn("Auth check failed:", error.message);
        localStorage.removeItem("gym_bro_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Register with manual credentials (Email, Password, Name) -> Triggers OTP Email
  const register = async ({ name, username, email, password }) => {
    try {
      setLoading(true);
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, username, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      showToast("Verification OTP sent to your email! 📬", "info");
      return data;
    } catch (error) {
      console.error("Register error:", error);
      showToast(error.message || "Registration failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify 6-digit OTP code to activate account and sign in
  const verifyOtp = async ({ email, otp }) => {
    try {
      setLoading(true);
      if (!email || !otp) {
        throw new Error("Please enter the 6-digit verification code");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      localStorage.setItem("gym_bro_token", data.token);
      setToken(data.token);
      setUser(data.user);
      closeAuthModal();
      showToast(`Welcome to Gym Bro, ${data.user.name}! 💪`, "success");
      return data.user;
    } catch (error) {
      console.error("Verify OTP error:", error);
      showToast(error.message || "Invalid or expired OTP", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Resend fresh OTP verification code
  const resendOtp = async (email) => {
    try {
      setLoading(true);
      if (!email) {
        throw new Error("Email is required");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      showToast("New 6-digit OTP sent! Check your inbox. 🚀", "success");
      return data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      showToast(error.message || "Failed to resend code", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google GIS Credential token or Profile object
  const loginWithGoogle = async (credentialOrProfile) => {
    try {
      setLoading(true);
      let payload = {};
      if (typeof credentialOrProfile === "string") {
        payload = { credential: credentialOrProfile };
      } else if (credentialOrProfile?.credential) {
        payload = { credential: credentialOrProfile.credential };
      } else if (credentialOrProfile?.profile) {
        payload = { profile: credentialOrProfile.profile };
      } else {
        payload = { profile: credentialOrProfile };
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "GOOGLE_CLIENT_ID_NOT_CONFIGURED") {
          showToast("Google OAuth Client ID is not configured on the backend. Please check server/.env", "error");
          throw new Error(data.message);
        }
        throw new Error(data.error || "Google authentication failed");
      }

      localStorage.setItem("gym_bro_token", data.token);
      setToken(data.token);
      setUser(data.user);
      closeAuthModal();
      showToast(`Welcome back, ${data.user.name}! 💪`, "success");
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      showToast(error.message || "Failed to sign in with Google", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Email / Password
  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (!password) {
        throw new Error("Please enter your password");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // If user is unverified, prompt OTP step
      if (data.requireOtp) {
        showToast("Please verify the OTP sent to your email 📬", "info");
        return { requireOtp: true, email: data.email };
      }

      localStorage.setItem("gym_bro_token", data.token);
      setToken(data.token);
      setUser(data.user);
      closeAuthModal();
      showToast(`Welcome back, ${data.user.name}! 🚀`, "success");
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      showToast(error.message || "Authentication failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user editable profile metrics
  const updateUserProfile = async (profileData) => {
    try {
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(profileData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setUser(data.user);
      showToast("Profile updated successfully! ✨", "success");
      return data.user;
    } catch (error) {
      console.error("Profile update error:", error);
      showToast(error.message || "Could not save profile changes", "error");
      throw error;
    }
  };

  // Log a completed workout session
  const logWorkoutSession = async (workoutPayload) => {
    try {
      if (!token) {
        openAuthModal("Please sign in to log completed workout sessions and track your athletic streak!");
        throw new Error("Please log in to track workout completions.");
      }

      const res = await fetch(`${API_BASE_URL}/api/workouts/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(workoutPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log workout session");
      }

      setUser(data.user);
      showToast(`Workout Completed! 🎉 Current Streak: ${data.user.currentStreak} 🔥`, "success");
      return data;
    } catch (error) {
      console.error("Log workout error:", error);
      showToast(error.message || "Could not log workout session", "error");
      throw error;
    }
  };

  // Logout current session
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      }).catch(() => {});
    } finally {
      localStorage.removeItem("gym_bro_token");
      setToken(null);
      setUser(null);
      closeAuthModal();
      showToast("Logged out successfully.", "info");
    }
  };

  // Logout from all devices
  const logoutAll = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logoutAll`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("gym_bro_token");
      setToken(null);
      setUser(null);
      closeAuthModal();
      showToast("Logged out from all devices.", "info");
    }
  };

  // Delete Account
  const deleteAccount = async () => {
    try {
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/users/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }

      localStorage.removeItem("gym_bro_token");
      setToken(null);
      setUser(null);
      closeAuthModal();
      showToast("Account deleted successfully.", "info");
    } catch (error) {
      showToast(error.message || "Failed to delete account", "error");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toast,
        showToast,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        register,
        verifyOtp,
        resendOtp,
        loginWithGoogle,
        loginWithEmail,
        updateUserProfile,
        logWorkoutSession,
        logout,
        logoutAll,
        deleteAccount,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
