import React, { useState } from "react";
import { Monitor, Moon, Sun, AlertTriangle, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer border-0",
        checked ? "bg-foreground" : "bg-secondary"
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-background shadow-xs transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

const themeOptions = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const units = ["Imperial (lb)", "Metric (kg)"];

const notificationDefaults = [
  {
    key: "workout",
    label: "Workout reminders",
    description: "Get a nudge on your scheduled training days.",
    on: true,
  },
  {
    key: "streak",
    label: "Streak alerts",
    description: "Warn me before I lose my active streak.",
    on: true,
  },
  {
    key: "progress",
    label: "Weekly progress report",
    description: "A summary of volume and PRs every Sunday.",
    on: false,
  },
  {
    key: "product",
    label: "Product updates",
    description: "New features and coaching tips from Gym Bro.",
    on: false,
  },
];

export const SettingsCard = () => {
  const { theme, setTheme } = useTheme();
  const { deleteAccount, showToast } = useAuth();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem("gymbro_unit") || "Imperial (lb)";
    } catch {
      return "Imperial (lb)";
    }
  });

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("gymbro_notifications");
      return saved ? JSON.parse(saved) : Object.fromEntries(notificationDefaults.map((n) => [n.key, n.on]));
    } catch {
      return Object.fromEntries(notificationDefaults.map((n) => [n.key, n.on]));
    }
  });

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem("gymbro_unit", newUnit);
    } catch (e) {
      console.warn("Storage error:", e);
    }
    showToast(`Measurement units set to ${newUnit}.`, "info");
  };

  const handleTogglePref = (key, value) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    try {
      localStorage.setItem("gymbro_notifications", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      showToast("Account deletion failed. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Appearance Panel */}
      <section className="rounded-xl border border-border bg-card shadow-xs">
        <div className="border-b border-border px-5 py-4 md:px-6">
          <h2 className="font-medium tracking-tight text-foreground">Appearance</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize how Gym Bro looks and measures.
          </p>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-tight text-foreground">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                      active
                        ? "border-foreground bg-secondary/70 shadow-xs ring-1 ring-foreground/10"
                        : "border-border bg-background hover:border-foreground/30 hover:bg-secondary/30"
                    )}
                  >
                    <Icon className="size-5 text-foreground" />
                    <span className="text-sm font-medium tracking-tight text-foreground">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-tight text-foreground">Units</p>
            <div className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-secondary/40 p-1 sm:grid-cols-2">
              {units.map((u) => {
                const active = unit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitChange(u)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium tracking-tight transition-colors cursor-pointer border-0",
                      active
                        ? "bg-background text-foreground shadow-xs"
                        : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Panel */}
      <section className="rounded-xl border border-border bg-card shadow-xs">
        <div className="border-b border-border px-5 py-4 md:px-6">
          <h2 className="font-medium tracking-tight text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Choose what Gym Bro sends you.
          </p>
        </div>
        <ul className="divide-y divide-border list-none p-0 m-0">
          {notificationDefaults.map((n) => (
            <li
              key={n.key}
              className="flex items-center justify-between gap-4 px-5 py-4 md:px-6"
            >
              <div>
                <p className="text-sm font-medium tracking-tight text-foreground m-0">
                  {n.label}
                </p>
                <p className="text-sm text-muted-foreground text-pretty m-0 mt-0.5">
                  {n.description}
                </p>
              </div>
              <Toggle
                label={n.label}
                checked={prefs[n.key] ?? n.on}
                onChange={(v) => handleTogglePref(n.key, v)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-destructive/30 bg-card shadow-xs">
        <div className="border-b border-destructive/20 px-5 py-4 md:px-6">
          <h2 className="font-medium tracking-tight text-destructive">Danger Zone</h2>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center md:px-6">
          <div>
            <p className="text-sm font-medium tracking-tight text-foreground m-0">
              Delete account
            </p>
            <p className="text-sm text-muted-foreground text-pretty m-0 mt-0.5">
              Permanently remove your account and all training data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="rounded-lg border border-destructive/40 bg-transparent px-4 py-2 text-sm font-medium tracking-tight text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
          >
            Delete account
          </button>
        </div>
      </section>

      {/* Confirmation Dialog */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => !isDeleting && setShowConfirmDelete(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-destructive/40 bg-card p-6 shadow-2xl text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-destructive mb-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="size-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Delete Account?
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              This action cannot be undone. All your workout records, active streaks, biometric logs, and custom training routines will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-white hover:bg-destructive/90 cursor-pointer border-0"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Everything</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
