import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SettingsCard = () => {
  const { logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    streakAlerts: true,
    newsletter: false
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Account Actions Card */}
      <div className="card info-card">
        <div className="info-card-header">
          <h3 className="section-title">
            <span>⚙️</span> Session & Account Management
          </h3>
        </div>

        <div className="settings-list">
          <div className="settings-item">
            <div>
              <div className="settings-item-title">Session Logout</div>
              <div className="settings-item-desc">Log out of your current session on this device.</div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              🚪 Logout
            </button>
          </div>

          <div className="settings-divider" />

          <div className="settings-item">
            <div>
              <div className="settings-item-title text-danger">Delete Account</div>
              <div className="settings-item-desc">
                Permanently delete your profile, workout history, and stored metrics from the database.
              </div>
            </div>
            <button className="btn-danger" onClick={() => setShowConfirmDelete(true)}>
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="card info-card">
        <div className="info-card-header">
          <h3 className="section-title">
            <span>🔔</span> Notification Preferences
          </h3>
        </div>

        <div className="settings-list">
          <div className="settings-toggle-item">
            <div>
              <div className="settings-item-title">Workout Reminders</div>
              <div className="settings-item-desc">Receive notifications to log your daily athletic session.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.workoutReminders}
              onChange={(e) =>
                setNotifications({ ...notifications, workoutReminders: e.target.checked })
              }
              className="toggle-checkbox"
            />
          </div>

          <div className="settings-toggle-item">
            <div>
              <div className="settings-item-title">Streak Protection Alerts</div>
              <div className="settings-item-desc">Alert when your active streak is at risk.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.streakAlerts}
              onChange={(e) => setNotifications({ ...notifications, streakAlerts: e.target.checked })}
              className="toggle-checkbox"
            />
          </div>
        </div>
      </div>

      {/* Confirm Delete Account Modal */}
      {showConfirmDelete && (
        <div className="overlay">
          <div className="modal card" style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h3 className="modal-title text-danger" style={{ fontSize: "18px" }}>
                ⚠️ Confirm Permanent Account Deletion
              </h3>
              <button className="modal-close-btn" onClick={() => setShowConfirmDelete(false)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
              Are you sure you want to delete your Gym Bro account? This action is permanent and will wipe all your workout statistics, streaks, and saved preferences from MongoDB.
            </p>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteAccount}>
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
