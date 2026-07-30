import React from "react";
import SettingsCard from "../components/profile/SettingsCard";

const SettingsPage = () => {
  return (
    <div className="page-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      <header className="compact-hero-header" style={{ marginBottom: "0" }}>
        <h1 className="compact-hero-title" style={{ fontSize: "36px" }}>
          Settings
        </h1>
        <p className="compact-hero-subtitle" style={{ fontSize: "14px" }}>
          Manage your account details, preferences, and privacy.
        </p>
      </header>

      <main style={{ width: "100%" }}>
        <SettingsCard />
      </main>
    </div>
  );
};

export default SettingsPage;
