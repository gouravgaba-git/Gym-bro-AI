import React from "react";
import SettingsCard from "../components/profile/SettingsCard";

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="mb-2 text-left space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">App Settings</h2>
        <p className="text-sm text-gray-400">
          Manage your session, notification preferences, and account privacy.
        </p>
      </header>

      <SettingsCard />
    </div>
  );
};

export default SettingsPage;
