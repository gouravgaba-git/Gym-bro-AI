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
    <div className="space-y-6">
      {/* Account Actions Card */}
      <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>⚙️</span> Account Settings
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div>
              <div className="font-bold text-sm text-white">Session Management</div>
              <div className="text-xs text-gray-400">Log out of your current session on this device.</div>
            </div>
            <button
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-xs transition-all cursor-pointer shrink-0"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              🚪 Logout
            </button>
          </div>

          <div className="border-t border-white/10" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div>
              <div className="font-bold text-sm text-rose-400">Delete Account</div>
              <div className="text-xs text-gray-400">
                Permanently delete your profile, workout history, and stored metrics from the database.
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all cursor-pointer shrink-0" onClick={() => setShowConfirmDelete(true)}>
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>🔔</span> Notification Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <div className="font-bold text-sm text-white">Workout Reminders</div>
              <div className="text-xs text-gray-400">Receive notifications to log your daily athletic session.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.workoutReminders}
              onChange={(e) =>
                setNotifications({ ...notifications, workoutReminders: e.target.checked })
              }
              className="w-5 h-5 accent-[#ff4b2b] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <div className="font-bold text-sm text-white">Streak Protection Alerts</div>
              <div className="text-xs text-gray-400">Alert when your active streak is at risk.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.streakAlerts}
              onChange={(e) => setNotifications({ ...notifications, streakAlerts: e.target.checked })}
              className="w-5 h-5 accent-[#ff4b2b] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Confirm Delete Account Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1524] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-400">
              ⚠️ Confirm Permanent Account Deletion
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Are you sure you want to delete your Gym Bro account? This action is permanent and will wipe all your workout statistics, streaks, and saved preferences from MongoDB.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs transition-all cursor-pointer" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/30 transition-all cursor-pointer" onClick={handleDeleteAccount}>
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
