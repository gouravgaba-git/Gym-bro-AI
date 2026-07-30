import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SettingsCard = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [preferences, setPreferences] = useState({
    darkMode: true,
    workoutReminders: true,
    streakAlerts: true
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      {/* 1. Account Section */}
      <div className="settings-card-subtle">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
              alt={user?.name || "User Avatar"}
              style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255, 75, 43, 0.4)" }}
              onError={(e) => {
                e.target.src = "https://lh3.googleusercontent.com/a/default-user";
              }}
            />
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: "800", fontSize: "18px", color: "#ffffff", margin: 0 }}>
                {user?.name || "Athlete Profile"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
                {user?.email || "athlete@gymbro.ai"}
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <span className="target-badge" style={{ fontSize: "11px", textTransform: "capitalize" }}>
                  🎯 {(user?.fitnessGoal || "muscle_gain").replace("_", " ")}
                </span>
                <span className="target-badge" style={{ fontSize: "11px", textTransform: "capitalize" }}>
                  🏋️ {user?.experienceLevel || "Beginner"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="watch-btn"
            onClick={() => navigate("/complete-profile")}
            style={{ padding: "8px 16px" }}
          >
            <span>Edit Profile ✏️</span>
          </button>
        </div>
      </div>

      {/* 2. Preferences Section */}
      <div className="settings-card-subtle">
        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Preferences
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Dark Mode */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>Dark Mode</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Sleek dark themes built for athletic focus</div>
            </div>
            <label className="ios-toggle-label">
              <input
                type="checkbox"
                className="ios-toggle-input"
                checked={preferences.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
              <span className="ios-toggle-slider" />
            </label>
          </div>

          <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />

          {/* Workout Reminders */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>Workout Reminders</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Daily alerts to keep your routine on schedule</div>
            </div>
            <label className="ios-toggle-label">
              <input
                type="checkbox"
                className="ios-toggle-input"
                checked={preferences.workoutReminders}
                onChange={() => handleToggle("workoutReminders")}
              />
              <span className="ios-toggle-slider" />
            </label>
          </div>

          <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />

          {/* Streak Protection Alerts */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>Streak Reminders</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Alerts when active training streaks are at risk</div>
            </div>
            <label className="ios-toggle-label">
              <input
                type="checkbox"
                className="ios-toggle-input"
                checked={preferences.streakAlerts}
                onChange={() => handleToggle("streakAlerts")}
              />
              <span className="ios-toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Privacy & Danger Zone */}
      <div className="settings-card-subtle" style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#ef4444" }}>Delete Account</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Permanently remove your account and stored metrics</div>
          </div>
          <button
            type="button"
            className="btn-danger-outline"
            onClick={() => setShowConfirmDelete(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirm Delete Account Modal */}
      {showConfirmDelete && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowConfirmDelete(false); }}>
          <div className="modal card" style={{ maxWidth: "460px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: "800", color: "#ef4444", margin: 0 }}>
                Confirm Account Deletion
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowConfirmDelete(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.55", marginBottom: "24px" }}>
              Are you sure you want to delete your account? This action cannot be undone and will delete your workout stats and preferences.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="footer-close-btn"
                onClick={() => setShowConfirmDelete(false)}
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={handleDeleteAccount}
                style={{ background: "#ef4444", color: "#ffffff", borderColor: "transparent" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
