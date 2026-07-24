import React from "react";
import SettingsCard from "../components/profile/SettingsCard";

const SettingsPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ margin: 0 }}>
        <h1 id="app-heading-title" style={{ fontSize: "36px", marginBottom: "8px" }}>App Settings</h1>
        <p className="hero-subtitle">
          Manage your active session, notification alerts, and account privacy options.
        </p>
      </header>

      <main>
        <SettingsCard />
      </main>
    </div>
  );
};

export default SettingsPage;
