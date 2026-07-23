import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
          }
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

  // Login with Google GIS Credential token
  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential })
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
        openAuthModal("Please sign in with Google to log completed workout sessions and track your athletic streak!");
        throw new Error("Please log in to track workout completions.");
      }

      const res = await fetch(`${API_BASE_URL}/api/workouts/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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

  // Logout
  const logout = () => {
    localStorage.removeItem("gym_bro_token");
    setToken(null);
    setUser(null);
    closeAuthModal();
    showToast("Logged out successfully.", "info");
  };

  // Delete Account
  const deleteAccount = async () => {
    try {
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/users/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        loginWithGoogle,
        updateUserProfile,
        logWorkoutSession,
        logout,
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
