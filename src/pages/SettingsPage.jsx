import React from "react";
import SettingsCard from "../components/profile/SettingsCard";

const SettingsPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ marginBottom: "16px", textAlign: "left" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>App Settings</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          Manage your session, notification preferences, and account privacy.
        </p>
      </header>

      <SettingsCard />
    </div>
  );
};

export default SettingsPage;
